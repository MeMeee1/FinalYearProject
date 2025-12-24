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

    // Log the full event for debugging
    console.log("Received Clerk event:", JSON.stringify(event.data, null, 2));

    // Clerk sometimes wraps in .object, sometimes not — handle both
    let userData = event.data.object || event.data;

    if (!userData || typeof userData !== "object") {
      console.error("Invalid payload: no user data", event.data);
      throw new Error("Invalid Clerk payload");
    }

    const clerkId = userData.id;
    if (!clerkId) {
      console.warn("Skipping sync: no clerkId in payload", userData);
      return { status: "skipped", reason: "no_clerk_id" };
    }

    // Safely handle email_addresses
    const emailAddresses = Array.isArray(userData.email_addresses)
      ? userData.email_addresses
      : [];

    let email = emailAddresses.find(
      (e: any) => e.id === userData.primary_email_address_id
    )?.email_address;

    if (!email && emailAddresses.length > 0) {
      email = emailAddresses[0].email_address;
    }

    if (!email) {
      console.warn("Skipping sync: no email found", { clerkId });
      return { status: "skipped", reason: "no_email" };
    }

    const name =
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "User";
    const imageUrl = userData.profile_image_url || userData.image_url || null;

    console.log("🔄 Syncing Clerk user to DB", { clerkId, email, name });

    try {
      const user = await prisma.user.upsert({
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
          role: "BUYER",
          isActive: true,
        },
      });

      console.log("✅ User synced successfully!", { userId: user.id, clerkId });
      return { status: "success", userId: user.id, clerkId };
    } catch (error: any) {
      console.error("❌ Prisma sync failed", {
        clerkId,
        message: error.message,
        code: error.code,
      });
      throw error;
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