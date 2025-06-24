// types/global.d.ts
import type { Database } from './database'

declare global {
  type DatabaseType = Database

  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof import('mongoose') | null
        promise: Promise<typeof import('mongoose')> | null
      }
    }
  }

  // Augment the global object with mongoose caching
  var mongoose: {
    conn: typeof import('mongoose') | null
    promise: Promise<typeof import('mongoose')> | null
  }
}

export {}
