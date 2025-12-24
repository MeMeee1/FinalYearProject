// src/inngest.ts  (or config/inngest.ts — wherever you keep it)

import { Inngest } from "inngest";
import { getPrisma } from "../utils/prisma_client"; // adjust path if needed

export const inngest = new Inngest({
  id: "ecommerce-app", // matches your app name in Inngest dashboard
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    name: "Sync Clerk User to Database",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = getPrisma();

    // Clerk wraps the actual user object in event.data.object
    const userData = event.data.object;

    const clerkId = userData.id;
    const email =
      userData.email_addresses.find(
        (e: any) => e.id === userData.primary_email_address_id
      )?.email_address ||
      userData.email_addresses[0]?.email_address;

    if (!clerkId || !email) {
      console.warn("Skipping user sync: missing clerkId or email", {
        clerkId,
        email,
      });
      return { status: "skipped", reason: "missing_required_fields" };
    }

    const name =
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "User";
    const imageUrl = userData.profile_image_url || null;

    console.log("🔄 Syncing user from Clerk", { clerkId, email, name });

    try {
      const user = await prisma.user.upsert({
        where: { clerkId },
        update: {
          email,
          name,
          imageUrl,
          // Add any other fields you want to keep in sync
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

      console.log("✅ User successfully synced/created", { userId: user.id });
      return { status: "success", userId: user.id, action: "upsert" };
    } catch (error) {
      console.error("❌ Failed to sync user from Clerk", error);
      throw error; // Important: re-throw so Inngest retries
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    name: "Delete User from Database",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const prisma = getPrisma();

    const userData = event.data.object;
    const clerkId = userData.id;

    if (!clerkId) {
      console.warn("Skipping delete: no clerkId in payload");
      return { status: "skipped" };
    }

    console.log("🗑️ Deleting user from DB", { clerkId });

    try {
      const result = await prisma.user.deleteMany({
        where: { clerkId },
      });

      if (result.count === 0) {
        console.log("No user found to delete", { clerkId });
        return { status: "not_found" };
      }

      console.log("✅ User deleted from DB", { clerkId });
      return { status: "success", deletedCount: result.count };
    } catch (error) {
      console.error("❌ Failed to delete user", error);
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];