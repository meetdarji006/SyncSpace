import { Request, Response } from "express";
import { db } from "../db";
import { organizations, organizationMembers, profiles } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const [newOrg] = await db
      .insert(organizations)
      .values({
        name,
        description,
        createdBy: userId,
      })
      .returning();

    await db.insert(organizationMembers).values({
      organizationId: newOrg.id,
      profileId: userId,
      role: "owner",
    });

    res.status(201).json(newOrg);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Failed to create organization" });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
       const allOrgs = await db.select().from(organizations);
       return res.json(allOrgs);
    }

    const memberOrgs = await db
      .select({
        organization: organizations,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.profileId, userId as string))
      .leftJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id)
      );

    const result = memberOrgs.map((row) => ({
        ...row.organization,
        memberRole: row.role,
        joinedAt: row.joinedAt
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(organizations).where(eq(organizations.id, id));

        if (result.length === 0) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching organization:", error);
        res.status(500).json({ error: "Failed to fetch organization" });
    }
}

export const joinOrganization = async (req: Request, res: Response) => {
  try {
    const { organizationId, userId } = req.body;

    if (!organizationId || !userId) {
      return res.status(400).json({ error: "Organization ID and User ID are required" });
    }

    const existingMember = await db
      .select()
      .from(organizationMembers)
      .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.profileId, userId)
          )
      );

    if (existingMember.length > 0) {
      return res.status(400).json({ error: "User is already a member of this organization" });
    }

    const [newMember] = await db
      .insert(organizationMembers)
      .values({
        organizationId,
        profileId: userId,
        role: "member",
      })
      .returning();


    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error joining organization:", error);
    res.status(500).json({ error: "Failed to join organization" });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, isPublic } = req.body;

        const [updatedOrg] = await db.update(organizations)
            .set({ name, description, isPublic, updatedAt: new Date() })
            .where(eq(organizations.id, id))
            .returning();

        if (!updatedOrg) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.json(updatedOrg);
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).json({ error: "Failed to update organization" });
    }
}

export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await db.delete(organizations).where(eq(organizations.id, id));

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).json({ error: "Failed to delete organization" });
    }
}

export const getOrganizationMembers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const members = await db.select({
            userId: profiles.id,
            name: profiles.name,
            avatarUrl: profiles.avatarUrl,
            role: organizationMembers.role,
            joinedAt: organizationMembers.joinedAt
        })
        .from(organizationMembers)
        .innerJoin(profiles, eq(organizationMembers.profileId, profiles.id))
        .where(eq(organizationMembers.organizationId, id));

        res.json(members);
    } catch (error) {
        console.error("Error fetching organization members:", error);
        res.status(500).json({ error: "Failed to fetch organization members" });
    }
}
