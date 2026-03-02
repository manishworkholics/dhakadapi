export const authorizePermission = (permissionName) => {
  return (req, res, next) => {

    const admin = req.admin;

    if (!admin || !admin.roles) {
      return res.status(403).json({ message: "Access denied" });
    }

    const hasPermission = admin.roles.some(role =>
      role.permissions.some(
        perm => perm.name === permissionName
      )
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    next();
  };
};