// src/inngest.ts (or wherever it is)

import { Inngest } from "inngest";
import { getPrisma } from "../utils/prisma_client";

export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = getPrisma();

    // Correct way to get Clerk payload
    const data = event.data.object; // ← This is the key fix!
    const clerkId = data.id;
    const email = data.email_addresses?.[0]?.email_address;
    const first_name = data.first_name;
    const last_name = data.last_name;
    const image_url = data.image_url;

    if (!email) {
      console.warn('Skipping user sync: no email in payload', { clerkId });
      return;
    }

    const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

    console.log('Syncing Clerk user to DB:', { clerkId, email, name }); // Debug log

    try {
      await prisma.user.upsert({
        where: { clerkId },
        update: { email, name, imageUrl: image_url },
        create: {
          clerkId,
          email,
          name,
          imageUrl: image_url,
          // Add defaults for other fields if needed
          role: "BUYER",
          isActive: true,
        },
      });

      console.log('✅ User synced successfully:', clerkId);
    } catch (err) {
      console.error('❌ Failed to sync user:', err);
      throw err; // Let Inngest retry
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const prisma = getPrisma();

    const data = event.data.object; // ← Key fix here too!
    const clerkId = data.id;

    console.log('Deleting user from DB:', clerkId);

    try {
      const deleted = await prisma.user.deleteMany({ where: { clerkId } });

      if (deleted.count === 0) {
        console.warn('No user found to delete for clerkId:', clerkId);
      } else {
        console.log('✅ User deleted from DB:', clerkId);
      }
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      throw err;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];