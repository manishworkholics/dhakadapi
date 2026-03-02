// import Admin from "./admin.model.js";
// import Role from "./role.model.js";

// export const assignSuperAdminToExistingAdmin = async () => {
//   try {
//     const superAdminRole = await Role.findOne({ name: "SuperAdmin" });

//     if (!superAdminRole) {
//       console.log("SuperAdmin role not found");
//       return;
//     }

//     const admins = await Admin.find({});

//     for (let admin of admins) {
//       if (!admin.roles || admin.roles.length === 0) {
//         admin.roles = [superAdminRole._id];
//         await admin.save();
//         console.log(`Assigned SuperAdmin role to ${admin.email}`);
//       }
//     }

//     console.log("Bootstrap completed ✅");

//   } catch (err) {
//     console.error("Bootstrap error:", err);
//   }
// };