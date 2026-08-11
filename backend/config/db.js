import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let isConnected = false
let isLocalFallback = false

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omnimarket'

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    })
    isConnected = true
    isLocalFallback = false
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.warn(`[MongoDB] Local MongoDB server not reachable (${error.message}).`)
    console.log(`[Multi-Tenant Engine] Initializing resilient JSON persistent database storage fallback...`)
    isLocalFallback = true
  }
}

export const getDBStatus = () => ({
  connected: isConnected,
  mode: isLocalFallback ? 'Persistent Local Multi-Tenant Engine' : 'Live MongoDB / Mongoose Engine',
})
