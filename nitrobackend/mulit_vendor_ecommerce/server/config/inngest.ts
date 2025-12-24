// src/inngest.ts (or wherever it is)

import { Inngest } from "inngest";
import { getPrisma } from "../utils/prisma_client";

export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = getPrisma();

    // Correctly extract from Clerk's nested "object" structure
    const userData = event.data.object;

    const clerkId = userData.id;
    const email = userData.primary_email_address_id 
      ? userData.email_addresses.find((e: { id: string; email_address: string }) => e.id === userData.primary_email_address_id)?.email_address
      : userData.email_addresses[0]?.email_address;

    if (!clerkId || !email) {
      console.warn('Skipping sync: missing clerkId or email', { clerkId, email });
      return { status: 'skipped', reason: 'missing_data' };
    }

    const name = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "User";
    const imageUrl = userData.profile_image_url || userData.image_url || null;

    console.log('🔄 Syncing Clerk user:', { clerkId, email, name });

    try {
      const upserted = await prisma.user.upsert({
        where: { clerkId },
        update: {
          email,
          name,
          imageUrl,
        },
        create: {
          clerkId,
          email,
          name,
          imageUrl,
          role: "BUYER", // default role
          isActive: true,
        },
      });

      console.log('✅ User synced to DB:', upserted.id);
      return { status: 'success', userId: upserted.id };
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