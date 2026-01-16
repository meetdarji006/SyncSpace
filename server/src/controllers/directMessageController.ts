import { Request, Response } from "express";
import { db } from "../db";
import { directMessages, profiles } from "../db/schema";
import { eq, or, and } from "drizzle-orm";
import { io } from "../sockets";


export const getDirectMessages = async (req: Request, res: Response) => {
    try {
        const { userId, otherUserId } = req.query;

        if (!userId || !otherUserId) {
             return res.status(400).json({ error: "User ID and Other User ID are required" });
        }

        const messages = await db.select({
            id: directMessages.id,
            content: directMessages.content,
            attachmentUrl: directMessages.attachmentUrl,
            attachmentType: directMessages.attachmentType,
            createdAt: directMessages.createdAt,
            senderId: directMessages.senderId,
            senderName: profiles.name,
            senderAvatar: profiles.avatarUrl
        })
        .from(directMessages)
        .leftJoin(profiles, eq(directMessages.senderId, profiles.id))
        .where(
            or(
                and(eq(directMessages.senderId, userId as string), eq(directMessages.receiverId, otherUserId as string)),
                and(eq(directMessages.senderId, otherUserId as string), eq(directMessages.receiverId, userId as string))
            )
        )
        .orderBy(directMessages.createdAt);

        res.json(messages);
    } catch (error) {
        console.error("Error fetching direct messages:", error);
        res.status(500).json({ error: "Failed to fetch direct messages" });
    }
};

export const sendDirectMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, content, attachmentUrl, attachmentType } = req.body;

        if (!senderId || !receiverId || (!content && !attachmentUrl)) {
            return res.status(400).json({ error: "Sender ID, Receiver ID, and Content (or Attachment) are required" });
        }

        const [newMessage] = await db.insert(directMessages).values({
            senderId,
            receiverId,
            content,
            attachmentUrl,
            attachmentType
        }).returning();

        // Fetch sender details
        const [sender] = await db.select().from(profiles).where(eq(profiles.id, senderId));

        const enrichedMessage = {
            ...newMessage,
            senderName: sender?.name || null,
            senderAvatar: sender?.avatarUrl || null
        };

        // Broadcast to receiver and sender (for multi-tab/device sync)
        if (io) {
            io.to(receiverId).emit('receive_direct_message', enrichedMessage);
            io.to(senderId).emit('receive_direct_message', enrichedMessage);
        }

        res.status(201).json(enrichedMessage);
    } catch (error) {
         console.error("Error sending direct message:", error);
         res.status(500).json({ error: "Failed to send direct message" });
    }
};
