import { Inngest } from "inngest";
import { getPrisma } from "../utils/prisma_client";

// Nitro-friendly Inngest configuration using Prisma
export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = getPrisma();
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data as any;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      console.warn('Skipping user sync: no email present in event payload', { clerkId });
      return;
    }

    const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

    try {
      // Use upsert to create or update existing users based on clerkId
      await prisma.user.upsert({
        where: { clerkId },
        update: { email, name, imageUrl: image_url },
        create: { clerkId, email, name, imageUrl: image_url },
      });
    } catch (err) {
      console.error('Failed to sync user from Inngest event', err);
      throw err;
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const prisma = getPrisma();
    const { id: clerkId } = event.data as any;

    try {
      // Use deleteMany to be resilient if multiple matches exist (shouldn't happen due to unique constraint)
      await prisma.user.deleteMany({ where: { clerkId } });
    } catch (err) {
      console.error('Failed to delete user from DB for clerkId', clerkId, err);
      throw err;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];
export default inngest;