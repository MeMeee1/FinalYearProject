import { defineNitroConfig } from "nitropack/config"

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
  }
});