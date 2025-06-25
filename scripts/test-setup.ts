import { config } from 'dotenv'

// Load environment variables from .env.local FIRST
config({ path: '.env.local' })

async function testProjectSetup() {
  try {
    console.log('🧪 Testing Mumicah project setup...')
    
    // Test environment variables
    console.log('\n📋 Environment Variables:')
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '❌ Missing')
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '❌ Missing')
    console.log('✅ MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '❌ Missing')
    
    // Test imports
    console.log('\n📦 Testing imports...')
    try {
      const { connectMongoDB } = await import('../src/lib/mongodb')
      console.log('✅ MongoDB lib: ✓ Import successful')
    } catch (error) {
      console.log('❌ MongoDB lib: Failed to import')
    }
    
    try {
      const models = await import('../src/models')
      console.log('✅ Models: ✓ Import successful')
      console.log('   Available models:', Object.keys(models).join(', '))
    } catch (error) {
      console.log('❌ Models: Failed to import')
    }
    
    try {
      const services = await import('../src/services')
      console.log('✅ Services: ✓ Import successful')
    } catch (error) {
      console.log('❌ Services: Failed to import')
    }
    
    // Test Supabase client (if available)
    console.log('\n🗄️ Testing Supabase connection...')
    try {
      const { createClient } = await import('../src/lib/supabase/server')
      const supabase = await createClient()
      console.log('✅ Supabase: ✓ Client created successfully')
    } catch (error) {
      console.log('❌ Supabase: Failed to create client -', error.message)
    }
    
    console.log('\n🎉 Project setup test completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Set up MongoDB (see QUICK_MONGODB_SETUP.md)')
    console.log('2. Run: pnpm run db:init')
    console.log('3. Run: pnpm dev')
    
  } catch (error) {
    console.error('❌ Error during project setup test:', error)
  }
}

testProjectSetup()
