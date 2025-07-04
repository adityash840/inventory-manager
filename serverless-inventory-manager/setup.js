#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Serverless Inventory Manager Setup');
console.log('=====================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  const envContent = `VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Get your Project URL and anon key from Settings > API');
console.log('3. Update the .env file with your Supabase credentials');
console.log('4. Run the SQL from DEPLOYMENT.md in your Supabase SQL Editor');
console.log('5. Run "npm run dev" to start the development server');
console.log('\n📖 See DEPLOYMENT.md for detailed instructions');
console.log('\n🎉 Your inventory manager is ready to deploy!'); 