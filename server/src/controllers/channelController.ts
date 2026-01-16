import { Request, Response } from "express";
import { db } from "../db";
import { channels, messages, profiles } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { io } from "../sockets";

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, organizationId, userId, parentChannelId } = req.body;

    if (!name || !organizationId || !userId) {
      return res.status(400).json({ error: "Name, Organization ID, and User ID are required" });
    }

    const [newChannel] = await db
      .insert(channels)
      .values({
        name,
        organizationId,
        createdBy: userId,
        parentChannelId: parentChannelId || null,
      })
      .returning();

    res.status(201).json(newChannel);
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ error: "Failed to create channel" });
  }
};

export const getChannels = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    const orgChannels = await db
      .select()
      .from(channels)
      .where(eq(channels.organizationId, organizationId));

    res.json(orgChannels);
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
};

export const updateChannel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const [updatedChannel] = await db.update(channels)
            .set({ name })
            .where(eq(channels.id, id))
            .returning();

        if (!updatedChannel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        res.json(updatedChannel);
    } catch (error) {
        console.error("Error updating channel:", error);
        res.status(500).json({ error: "Failed to update channel" });
    }
}

export const deleteChannel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.delete(channels).where(eq(channels.id, id));

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting channel:", error);
        res.status(500).json({ error: "Failed to delete channel" });
    }
}


export const getMessages = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;

        const channelMessages = await db.select({
            id: messages.id,
            content: messages.content,
            attachmentUrl: messages.attachmentUrl,
            attachmentType: messages.attachmentType,
            createdAt: messages.createdAt,
            senderId: messages.senderId,
            senderName: profiles.name,
            senderAvatar: profiles.avatarUrl
        })
            .from(messages)
            .leftJoin(profiles, eq(messages.senderId, profiles.id))
            .where(eq(messages.channelId, channelId))
            .orderBy(messages.createdAt);

        res.json(channelMessages);
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { channelId, userId, content, attachmentUrl, attachmentType } = req.body;

        if (!channelId || !userId || (!content && !attachmentUrl)) {
            return res.status(400).json({ error: "Channel ID, User ID and Content (or Attachment) are required" });
        }

        const [newMessage] = await db.insert(messages).values({
            channelId,
            senderId: userId,
            content,
            attachmentUrl,
            attachmentType
        }).returning();

        // Fetch sender details
        const [sender] = await db.select().from(profiles).where(eq(profiles.id, userId));

        const enrichedMessage = {
            ...newMessage,
            senderName: sender?.name || null,
            senderAvatar: sender?.avatarUrl || null
        };

        // Broadcast to channel
        if (io) {
            io.to(channelId).emit('receive_message', enrichedMessage);
        }

        res.status(201).json(enrichedMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
}
