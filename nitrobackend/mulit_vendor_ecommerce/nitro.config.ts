import { defineNitroConfig } from "nitropack/config"
import path from "path"

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "server",
  imports: false,
  
  // Serve static files from admin build
  publicAssets: [
    {
      baseURL: '/',
      dir: path.resolve(__dirname, '../../admin/dist'),
      maxAge: 31536000 // 1 year for production
    }
  ],
  // Handle SPA routing
  prerender: {
    crawlLinks: false,
    routes: []
  },
   runtimeConfig: {
    // This makes env vars available at runtime
    databaseUrl: process.env.DATABASE_URL,
  },
  // Ensure dotenv is loaded during build and runtime

});