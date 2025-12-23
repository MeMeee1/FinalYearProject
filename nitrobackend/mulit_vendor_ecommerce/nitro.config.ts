import { defineNitroConfig } from "nitropack/config"
import path from "path"

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "server",
  imports: false,
  experimental: {
    database: true
  },
  database: {
    default: {
      connector: 'postgresql',
      options: {
        url: 'postgresql://neondb_owner:npg_4NsWQEDC5xOX@ep-soft-art-a4iqor8v-pooler.us-east-1.aws.neon.tech/finalyearproject?sslmode=require&channel_binding=require'
      }
    }
  },
  devDatabase: {
    default: {
      connector: 'postgresql',
      options: {
        url: 'postgresql://postgres:123456@localhost:5432/FinalYearProject'
      }
    }
  },
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
  }
});