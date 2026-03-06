import express from "express";
import {
    createSeo,
    getAllSeo,
    getSeoByPage,
    updateSeo,
    deleteSeo
} from "./seo.controller.js";

import { adminProtect } from "../../middleware/adminMiddleware.js";
import { authorizePermission } from "../../middleware/permissionMiddleware.js";

const router = express.Router();


// create seo
router.post(
    "/create",
    adminProtect,
    authorizePermission("manage_admins"),
    createSeo
);


// get all
router.get("/list", getAllSeo);


// get by page
router.get("/:page", getSeoByPage);


// update
router.put(
    "/:id",
    adminProtect,
    authorizePermission("manage_admins"),
    updateSeo
);


// delete
router.delete(
    "/:id",
    adminProtect,
    authorizePermission("manage_admins"),
    deleteSeo
);

export default router;