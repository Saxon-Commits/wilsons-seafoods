export interface FishProduct {
  id?: number;
  name: string;
  price: string;
  image_url: string;
  is_fresh?: boolean;
  is_visible?: boolean;
  category?: string;
}

export interface OpeningHour {
  day: string;
  time: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
}

export interface HomepageContent {
  hero_title: string;
  hero_subtitle: string;
  announcement_text: string;
  about_text: string;
  about_image_url: string;
  gateway1_image_url?: string;
  gateway1_title?: string;
  gateway1_description?: string;
  gateway1_button_text?: string;
  gateway1_button_url?: string;
  gateway2_image_url?: string;
  gateway2_title?: string;
  gateway2_description?: string;
  gateway2_button_text?: string;
  gateway2_button_url?: string;
}

export interface SiteSettings {
  logo_url: string;
  background_url: string | null;
  social_links?: SocialLinks;
  opening_hours?: OpeningHour[];
}