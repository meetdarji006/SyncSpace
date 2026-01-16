
import { Router } from "express";
import {
  createChannel,
  getChannels,
  updateChannel,
  deleteChannel,
  sendMessage,
  getMessages,
} from "../controllers/channelController";

const router = Router();

// Channel routes
router.post("/", createChannel);
router.get("/organization/:organizationId", getChannels); // Get all channels for an org
router.patch("/:id", updateChannel);
router.delete("/:id", deleteChannel);

// Message routes (Group messaging in channel)
router.post("/message", sendMessage);
router.get("/:channelId/messages", getMessages);

export default router;
