
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFacebook() {
    const newFacebookUrl = 'https://www.facebook.com/p/Wilsons-Seafoods-Factory-Outlet-61551096984770/';

    console.log('Fetching existing settings...');
    const { data: existing, error: fetchError } = await supabase.from('site_settings').select('*').single();

    if (fetchError) {
        console.error('Error fetching existing settings:', fetchError);
        return;
    }

    if (!existing) {
        console.error('No existing settings found to update.');
        return;
    }

    const updatedLinks = {
        ...existing.social_links,
        facebook: newFacebookUrl
    };

    console.log('Updating Facebook link to:', newFacebookUrl);
    const { error: updateError } = await supabase
        .from('site_settings')
        .update({ social_links: updatedLinks })
        .eq('id', existing.id);

    if (updateError) {
        console.error('Error updating settings:', updateError);
    } else {
        console.log('Successfully updated Facebook link.');
    }
}

updateFacebook();
