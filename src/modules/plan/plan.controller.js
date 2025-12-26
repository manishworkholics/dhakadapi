import Plan from "./Plan.model.js";
import UserPlan from "./UserPlan.model.js";
import User from "../auth/auth.model.js";
import razorpay from "../../config/razorpay.js";
import Payment from "./Payment.model.js";
import crypto from "crypto";


export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const gstAmount = (plan.price * plan.gstPercent) / 100;
        const totalAmount = plan.price + gstAmount;

        const order = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        });

        await Payment.create({
            user: userId,
            plan: plan._id,
            razorpayOrderId: order.id,
            amount: totalAmount,
            status: "created",
        });

        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            amount: totalAmount,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = "paid";
        await payment.save();

        // Activate plan
        const plan = await Plan.findById(payment.plan);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        await UserPlan.updateMany(
            { user: payment.user, status: "active" },
            { status: "expired" }
        );

        const userPlan = await UserPlan.create({
            user: payment.user,
            plan: plan._id,
            startDate,
            endDate,
            status: "active",
            paymentStatus: "paid",
        });

        await User.findByIdAndUpdate(payment.user, {
            currentPlan: userPlan._id,
        });

        res.json({
            success: true,
            message: "Payment verified & plan activated",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createPlan = async (req, res) => {
    try {
        const plan = await Plan.create(req.body);
        res.json({ success: true, plan });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


export const getPlans = async (req, res) => {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, plans });
};



// ====================== Update Plan ======================
export const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        return res.json({
            success: true,
            message: "Plan updated successfully",
            plan: updatedPlan,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating plan",
        });
    }
};

// ====================== Delete Plan ======================
export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlan = await Plan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        return res.json({
            success: true,
            message: "Plan deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting plan",
        });
    }
};


export const getAllPaymentHistory = async (req, res) => {
    const plans = await Payment.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, plans });
};

export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const history = await Payment.find({ user: userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, history });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const buyPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        const { planId } = req.body;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        // Expire old plan
        await UserPlan.updateMany(
            { user: userId, status: "active" },
            { status: "expired" }
        );

        const userPlan = await UserPlan.create({
            user: userId,
            plan: plan._id,
            startDate,
            endDate,
            status: "active",
            paymentStatus: "pending",
        });

        await User.findByIdAndUpdate(userId, {
            currentPlan: userPlan._id,
        });

        res.json({
            success: true,
            message: "Plan activated",
            userPlan,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getMyPlan = async (req, res) => {
    const userPlan = await UserPlan.findOne({
        user: req.user._id,
        status: "active",
    }).populate("plan");

    res.json({ success: true, userPlan });
};
