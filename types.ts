export interface FishProduct {
  id?: number;
  name: string;
  price: string;
  image_url: string;
  is_fresh?: boolean;
  is_visible?: boolean;
}

export interface OpeningHour {
  day: string;
  time: string;
}

export interface HomepageContent {
  hero_title: string;
  hero_subtitle: string;
  announcement_text: string;
  about_text: string;
  about_image_url: string;
}