import Permission from "./permission.model.js";
import Role from "./role.model.js";

export const seedRolesAndPermissions = async () => {
  try {
    console.log("Seeding roles & permissions...");

    const permissionsList = [
      "manage_users",
      "manage_profiles",
      "manage_payments",
      "manage_plans",
      "view_dashboard",
      "manage_admins",
    ];

    const permissions = {};

    // Create permissions if not exists
    for (let perm of permissionsList) {
      let existing = await Permission.findOne({ name: perm });

      if (!existing) {
        existing = await Permission.create({
          name: perm,
          description: perm,
        });
      }

      permissions[perm] = existing._id;
    }

    // Create Roles
    const rolesData = [
      {
        name: "SuperAdmin",
        permissions: Object.values(permissions),
      },
      {
        name: "Admin",
        permissions: [
          permissions.manage_users,
          permissions.manage_profiles,
          permissions.manage_plans,
          permissions.view_dashboard,
        ],
      },
      {
        name: "Editor",
        permissions: [
          permissions.manage_profiles,
          permissions.view_dashboard,
        ],
      },
      {
        name: "Sales",
        permissions: [
          permissions.manage_payments,
          permissions.view_dashboard,
        ],
      },
    ];

    for (let roleData of rolesData) {
      let existingRole = await Role.findOne({ name: roleData.name });

      if (!existingRole) {
        await Role.create(roleData);
      }
    }

    console.log("Roles & permissions seeded successfully ✅");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};