const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
s.from('products').select('*').limit(1).then(res => {
  console.log('Products keys:', res.data && res.data[0] ? Object.keys(res.data[0]) : res.error);
  // Also try to add a column using sql if mcp is unavailable? We can't do DDL with anon key.
});
