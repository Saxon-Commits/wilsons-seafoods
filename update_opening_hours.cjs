const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse environment variables
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    console.error('\nPlease make sure you have a .env.local file with:');
    console.error('VITE_SUPABASE_URL=your_url');
    console.error('VITE_SUPABASE_ANON_KEY=your_key');
    process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

const FULL_WEEK_HOURS = [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: 'Closed' },
    { day: 'Wednesday', time: '7am - 1pm' },
    { day: 'Thursday', time: '7am - 2pm' },
    { day: 'Friday', time: '7am - 2:30pm' },
    { day: 'Saturday', time: 'Closed' },
    { day: 'Sunday', time: 'Closed' },
];

async function updateOpeningHours() {
    console.log('\n📅 Updating opening hours to include all 7 days of the week...\n');

    // First get the current record
    const { data: currentData, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (fetchError) {
        console.error('❌ Error fetching current settings:', fetchError);
        process.exit(1);
    }

    console.log('Current opening hours:', JSON.stringify(currentData.opening_hours, null, 2));

    // Try upsert instead of update
    const { data: upsertData, error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            ...currentData,
            opening_hours: FULL_WEEK_HOURS
        })
        .select();

    if (upsertError) {
        console.error('❌ Error upserting opening hours:', upsertError);
        process.exit(1);
    }

    console.log('\nUpsert result:', JSON.stringify(upsertData, null, 2));

    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
        .from('site_settings')
        .select('opening_hours')
        .eq('id', 1)
        .single();

    if (verifyError) {
        console.error('❌ Error verifying update:', verifyError);
        process.exit(1);
    }

    console.log('\n✅ Successfully updated opening hours!');
    console.log('\n📋 New opening hours:');
    verifyData.opening_hours.forEach(hour => {
        console.log(`  ${hour.day.padEnd(10)}: ${hour.time}`);
    });
    console.log('\n✨ Done! Refresh your browser to see the changes.\n');
}

updateOpeningHours().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
