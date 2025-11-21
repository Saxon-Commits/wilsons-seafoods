
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables.');
    console.log('VITE_SUPABASE_URL:', supabaseUrl); // Debug log (safe to show partial if needed, but usually hidden)
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSettings() {
    const socialLinks = {
        facebook: 'https://www.facebook.com/profile.php?id=61551096984770&sk=photos',
        instagram: 'https://www.instagram.com/wilsonsseafoods/'
    };

    const openingHours = [
        { day: 'Monday', open: '09:00', close: '17:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '17:00', closed: false },
        { day: 'Friday', open: '09:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '09:00', close: '15:00', closed: false },
        { day: 'Sunday', open: '', close: '', closed: true }
    ];

    // Check if row exists
    const { data: existing, error: fetchError } = await supabase.from('site_settings').select('*').single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        console.error('Error fetching existing settings:', fetchError);
        return;
    }

    let error;
    if (existing) {
        console.log('Updating existing settings...');
        const { error: updateError } = await supabase
            .from('site_settings')
            .update({ social_links: socialLinks, opening_hours: openingHours })
            .eq('id', existing.id);
        error = updateError;
    } else {
        console.log('Inserting new settings...');
        const { error: insertError } = await supabase
            .from('site_settings')
            .insert([{ social_links: socialLinks, opening_hours: openingHours }]);
        error = insertError;
    }

    if (error) {
        console.error('Error updating settings:', error);
    } else {
        console.log('Successfully updated site_settings with social links and hours.');
    }
}

updateSettings();
