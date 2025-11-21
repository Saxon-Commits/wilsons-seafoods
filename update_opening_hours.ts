import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    console.error('You may need to run: source .env.local');
    process.exit(1);
}

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
    console.log('Updating opening hours to include all 7 days of the week...');

    const { data, error } = await supabase
        .from('site_settings')
        .update({ opening_hours: FULL_WEEK_HOURS })
        .eq('id', 1)
        .select();

    if (error) {
        console.error('Error updating opening hours:', error);
        process.exit(1);
    }

    console.log('✅ Successfully updated opening hours!');
    console.log('Updated data:', JSON.stringify(data, null, 2));
}

updateOpeningHours();
