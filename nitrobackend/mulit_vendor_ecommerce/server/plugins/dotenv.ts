import 'dotenv/config'
import { defineNitroPlugin } from 'nitropack/runtime'
export default defineNitroPlugin(() => {
  console.log('🔌 Dotenv plugin (server/plugins) loaded — DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing')
})