// src/inngest.ts
import { Inngest } from "inngest";
import { getPrisma } from "../utils/prisma_client";

export const inngest = new Inngest({
  id: "ecommerce-app",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    name: "Sync Clerk User to Database",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = getPrisma();

    console.log("Received Clerk event:", JSON.stringify(event.data, null, 2));

    // Clerk sends data directly in event.data, not event.data.object
    const userData = event.data;

    if (!userData || typeof userData !== "object") {
      console.error("Invalid payload: no user data", event.data);
      throw new Error("Invalid Clerk payload");
    }

    const clerkId = userData.id;
    if (!clerkId) {
      console.warn("Skipping sync: no clerkId in payload", userData);
      return { status: "skipped", reason: "no_clerk_id" };
    }

    // Extract email
    const emailAddresses = Array.isArray(userData.email_addresses)
      ? userData.email_addresses
      : [];

    let email = emailAddresses.find(
      (e: any) => e.id === userData.primary_email_address_id
    )?.email_address;

    if (!email && emailAddresses.length > 0) {
      email = emailAddresses[0].email_address;
    }

    // Fallback email if none provided (similar to your Express version)
    if (!email) {
      email = `${clerkId}@clerk.local`;
      console.warn("No email found, using fallback", { clerkId, email });
    }

    // Build name from first_name and last_name
    const firstName = userData.first_name || email.split("@")[0] || "Clerk";
    const lastName = userData.last_name || "User";
    const name = `${firstName} ${lastName}`.trim();

    const imageUrl = userData.image_url || userData.profile_image_url || null;

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

    // Access data directly from event.data
    const clerkId = event.data?.id;

    if (!clerkId) {
      console.warn("Skipping delete: no clerkId in payload");
      return { status: "skipped", reason: "no_clerk_id" };
    }

    console.log("🗑️ Deleting user from DB", { clerkId });

    try {
      const result = await prisma.user.deleteMany({
        where: { clerkId },
      });

      if (result.count === 0) {
        console.log("⚠️ No user found to delete", { clerkId });
        return { status: "not_found", clerkId };
      }

      console.log("✅ User deleted from DB", { clerkId, count: result.count });
      return { status: "success", deletedCount: result.count, clerkId };
    } catch (error: any) {
      console.error("❌ Failed to delete user", {
        clerkId,
        message: error.message,
      });
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];