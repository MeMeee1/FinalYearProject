import { defineEventHandler} from "h3"
export default defineEventHandler(() => {
  return `<h1>Hello from Nitro Backend!</h1>`;
})