import { up } from "@auth/d1-adapter"
import { env } from "process"
 
let migrated = false
async function migrationHandle() {
  if (!migrated) {
    try {
      await up(env.db)
      migrated = true
    } catch (e: any) {
      console.log(e.cause.message, e.message)
    }
  }
}

export function register() {

  //migrationHandle();
  
}