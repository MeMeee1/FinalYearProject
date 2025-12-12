import express from "express";
import path from "path";

import { ENV } from "./config/env.js";
import { connectDB,sequelize } from "./config/db.js";
import {serve} from"inngest/express";
import { functions,inngest } from "./config/inggest.js";

import {clerkMiddleware} from "@clerk/express";
const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({client: inngest, functions}));


app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
    await connectDB();
    sequelize
      .sync({ force: true, logging: false })
      .then(() => {
        console.log('✅ All models were synchronized successfully.');
      })
      .catch((error) => {
        console.error('❌ Error synchronizing models:', error);
      });
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running");
  });
};

startServer();