
import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  joinOrganization,
  getOrganizationMembers
} from "../controllers/organizationController";

const router = Router();

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);
router.patch("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);
router.post("/join", joinOrganization);
router.get("/:id/members", getOrganizationMembers);

export default router;
