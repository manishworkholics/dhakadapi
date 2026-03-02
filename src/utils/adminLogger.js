import AdminLog from "../modules/admin/adminLog.model.js";

export const logAdminAction = async ({
  adminId,
  action,
  targetType,
  targetId,
  metadata,
  ip,
}) => {
  try {
    await AdminLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("Admin log error:", err);
  }
};