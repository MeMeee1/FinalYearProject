import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import crypto from "crypto";
import { User } from "../models/user.js";

export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    // Build a user object compatible with our Sequelize `User` model.
    // The Clerk webhook may omit some fields, but our model requires
    // `firstName`, `lastName`, `email`, `phoneNumber`, `password`, and `clerkId`.
    const email = email_addresses?.[0]?.email_address || `${id}@clerk.local`;
    const firstName = first_name || email.split("@")[0] || "Clerk";
    const lastName = last_name || "User";

    const newUser = {
      clerkId: id,
      email,
      firstName,
      lastName,
      imageUrl: image_url || null,
      // Phone number is required in the model and unique; use a Clerk-prefixed
      // placeholder to ensure non-null/unique values when Clerk doesn't provide one.
      phoneNumber: `clerk-${id}`,
      // Password is required in the model; generate a strong random value.
      password: crypto.randomBytes(32).toString("hex"),
    };

    // Avoid duplicate creations if a user with this clerkId already exists.
    const [user, created] = await User.findOrCreate({
      where: { clerkId: id },
      defaults: newUser,
    });

    if (!created) {
      // If the user already existed, update fields that Clerk provides.
      await user.update({ email, firstName, lastName, imageUrl });
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    // Use Sequelize destroy to remove the user by clerkId
    await User.destroy({ where: { clerkId: id } });
  }
);

export const functions = [syncUser, deleteUserFromDB];