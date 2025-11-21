import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

import Header from './components/Header';
import ProductList from './components/ProductList';
import Hours from './components/Hours';
import Footer from './components/Footer';
import EditProductModal from './components/EditProductModal';
import { OPENING_HOURS, INITIAL_LOGO_URL, INITIAL_HOMEPAGE_CONTENT } from './constants';
import { FishProduct, OpeningHour, HomepageContent, SiteSettings, SocialLinks } from './types';
import { BoxIcon } from './components/icons/BoxIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import AnnouncementBanner from './components/AnnouncementBanner';
import AboutUs from './components/AboutUs';
import { HomeIcon } from './components/icons/HomeIcon';
import { DashboardIcon } from './components/icons/DashboardIcon';
import ContactForm from './components/ContactForm';
import { SearchIcon } from './components/icons/SearchIcon';

// --- Gateway Section Components ---
const GatewayCard: React.FC<{
  image_url: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ imageUrl, headline, description, buttonText, buttonHref, onClick }) => {
  const isExternal = buttonHref.startsWith('http');
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700/80 group transform transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-2 flex flex-col">
      <div className="relative overflow-hidden h-64 flex-shrink-0">
        <img src={imageUrl} alt={headline} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-6 md:p-8 text-center flex flex-col flex-grow">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">{headline}</h3>
        <p className="text-slate-400 mb-6 flex-grow">{description}</p>
        <div className="mt-auto">
          <a
            href={buttonHref}
            onClick={onClick}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-block bg-brand-blue text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-opacity-80 transform hover:scale-105 transition-all duration-300"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

const GatewaySection: React.FC<{
  content: HomepageContent;
  onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ content, onSmoothScroll }) => {
  return (
    <section>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <GatewayCard
          imageUrl={content.gateway1_image_url || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200&auto=format&fit=crop"}
          headline={content.gateway1_title || "Shop Our Public Store"}
          description={content.gateway1_description || "Get the freshest Tasmanian seafood and pickup in store today. Browse our public store and pay online."}
          buttonText={content.gateway1_button_text || "Shop Now"}
          buttonHref={content.gateway1_button_url || "#products"}
          onClick={onSmoothScroll}
        />
        <GatewayCard
          imageUrl={content.gateway2_image_url || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"}
          headline={content.gateway2_title || "Wholesale & Chef's Portal"}
          description={content.gateway2_description || "For our restaurant, chef, and wholesale partners. Log in to your Fresho account or apply for a new trade account here."}
          buttonText={content.gateway2_button_text || "Enter Portal"}
          buttonHref={content.gateway2_button_url || "https://www.fresho.com/"}
        />
      </div>
    </section>
  );
};


// --- Home Page Component ---
const HomePage: React.FC<{
  logoUrl: string;
  backgroundUrl: string | null;
  hours: OpeningHour[];
  content: HomepageContent;
  isBannerVisible: boolean;
  onDismissBanner: () => void;
  filteredProducts: FishProduct[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  socialLinks: SocialLinks;
}> = ({ logoUrl, backgroundUrl, hours, content, isBannerVisible, onDismissBanner, filteredProducts, searchTerm, setSearchTerm, activeFilter, setActiveFilter, socialLinks }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500/30">
      {isBannerVisible && (
        <AnnouncementBanner
          text={content.announcement_text}
          onDismiss={onDismissBanner}
        />
      )}

      <Header logoUrl={logoUrl} />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-900 z-10"></div>
          {backgroundUrl && (
            <div
              className="w-full h-full bg-cover bg-center transform scale-105 animate-slow-zoom"
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            ></div>
          )}
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            {content.hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 font-light tracking-wide max-w-3xl mx-auto drop-shadow-md">
            {content.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={(e) => handleSmoothScroll(e as any)}
              className="bg-brand-blue hover:bg-opacity-90 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-blue/30 text-lg"
            >
              <a href="#products">Shop Fresh Seafood</a>
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50 text-lg">
              <a href="#about" onClick={(e) => handleSmoothScroll(e as any)}>Our Story</a>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* Gateway Cards Section */}
        <GatewaySection content={content} onSmoothScroll={handleSmoothScroll} />

        {/* Products Section */}
        <section id="products" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Fresh From The Boat</h2>
            <div className="h-1 w-24 bg-brand-blue mx-auto rounded-full"></div>
          </div>

          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          <ProductList products={filteredProducts} />
        </section>

        {/* About Us Section */}
        <section id="about" className="scroll-mt-24">
          <AboutUs text={content.about_text} image_url={content.about_image_url} />
        </section>

        {/* Hours & Location */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-serif font-bold text-white mb-6">Visit Our Store</h2>
              <p className="text-slate-400 text-lg mb-8">
                Experience the finest selection of seafood in person. Our friendly staff are ready to help you choose the perfect catch for your next meal.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-slate-300 mb-4">
                <HomeIcon className="w-6 h-6 text-brand-blue" />
                <span className="text-lg">5 Sussex St, Glenorchy TAS 7010</span>
              </div>
            </div>
            <Hours hours={hours} />
          </div>
          <div className="h-[400px] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.720466628646!2d147.2799489766666!3d-42.82864697116116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaa6e74f78091157b%3A0x55c65545e143327!2sWilson's%20Seafoods!5e0!3m2!1sen!2sau!4v1709600000000!5m2!1sen!2sau"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wilson's Seafoods Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-400">Have a question or special order? Send us a message.</p>
          </div>
          <ContactForm />
        </section>
      </main>

      <Footer socialLinks={socialLinks} />
    </div>
  );
};

// --- Product Filters ---
const ProductFilters: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}> = ({ searchTerm, setSearchTerm, activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Fresh Fish', 'Shellfish', 'White Fish', 'Sashimi', 'Other'];

  const baseButtonClass = "px-6 py-2.5 rounded-full font-semibold text-md transition-all duration-300";
  const activeButtonClass = "bg-ice-blue text-slate-900 shadow";
  const inactiveButtonClass = "bg-slate-800 text-slate-300 hover:bg-slate-700";

  return (
    <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
      <div className="relative w-full md:w-72">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-ice-blue"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>
      <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-full border border-slate-700/50">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`${baseButtonClass} ${activeFilter === filter ? activeButtonClass : inactiveButtonClass}`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Admin Sidebar ---
const AdminSidebar: React.FC<{
  activeView: string;
  onNavigate: (view: 'dashboard' | 'products' | 'homepage' | 'settings') => void;
}> = ({ activeView, onNavigate }) => {
  const baseClasses = "flex items-center space-x-3 w-full text-left p-3 rounded-md transition-colors text-lg";
  const activeClasses = "bg-sky-600 text-white";
  const inactiveClasses = "text-slate-300 hover:bg-slate-700";

  return (
    <aside className="w-64 bg-slate-800 p-4 flex flex-col">
      <div className="text-white text-2xl font-bold mb-10 pl-2 font-serif">
        Admin Panel
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <button onClick={() => onNavigate('dashboard')} className={`${baseClasses} ${activeView === 'dashboard' ? activeClasses : inactiveClasses}`}>
              <DashboardIcon className="w-6 h-6" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('products')} className={`${baseClasses} ${activeView === 'products' ? activeClasses : inactiveClasses}`}>
              <BoxIcon className="w-6 h-6" />
              <span>Products</span>
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('homepage')} className={`${baseClasses} ${activeView === 'homepage' ? activeClasses : inactiveClasses}`}>
              <HomeIcon className="w-6 h-6" />
              <span>Homepage</span>
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('settings')} className={`${baseClasses} ${activeView === 'settings' ? activeClasses : inactiveClasses}`}>
              <SettingsIcon className="w-6 h-6" />
              <span>Site Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// --- Admin Dashboard View ---
const AdminDashboard: React.FC<{ productCount: number; freshCount: number; }> = ({ productCount, freshCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-lg">Total Products</h3>
        <p className="text-4xl font-bold text-white mt-2">{productCount}</p>
      </div>
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-lg">"Fresh Today" Items</h3>
        <p className="text-4xl font-bold text-white mt-2">{freshCount}</p>
      </div>
    </div>
  )
}


// --- Admin Homepage Content View ---
const AdminHomepageContent: React.FC<{
  content: HomepageContent;
  onContentChange: (field: keyof HomepageContent, value: string) => void;
}> = ({ content, onContentChange }) => {
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof HomepageContent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    supabase.storage.from('images').upload(filePath, file).then(({ error }) => {
      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      onContentChange(field, data.publicUrl);
    });
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-slate-200 mb-3">Hero Section</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={content.hero_title}
            onChange={(e) => onContentChange('hero_title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Hero Title"
          />
          <textarea
            value={content.hero_subtitle}
            onChange={(e) => onContentChange('hero_subtitle', e.target.value)}
            className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Hero Subtitle"
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-200 mb-3">Announcement Banner</h3>
        <textarea
          value={content.announcement_text}
          onChange={(e) => onContentChange('announcement_text', e.target.value)}
          className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Enter announcement text..."
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-200 mb-3">"About Us" Section</h3>
        <textarea
          value={content.about_text}
          onChange={(e) => onContentChange('about_text', e.target.value)}
          className="w-full h-40 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Enter about us text..."
        />
        <div className="relative group w-full h-48">
          <img src={content.about_image_url} alt="About Us Background" className="w-full h-full rounded-md object-cover shadow-md bg-slate-700" />
          <button
            onClick={() => bgInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
            aria-label="Change about us image"
          >
            <CameraIcon className="w-8 h-8 text-white" />
          </button>
        </div>
        <input type="file" ref={bgInputRef} onChange={(e) => handleFileChange(e, 'about_image_url')} className="hidden" accept="image/*" />
        <p className="text-center text-slate-400 text-sm">Hover over the image to change it.</p>
      </div>

      {/* Gateway Card 1 */}
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">Gateway Card 1 (Public Store)</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={content.gateway1_title || ''}
            onChange={(e) => onContentChange('gateway1_title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Card Title"
          />
          <textarea
            value={content.gateway1_description || ''}
            onChange={(e) => onContentChange('gateway1_description', e.target.value)}
            className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Card Description"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={content.gateway1_button_text || ''}
              onChange={(e) => onContentChange('gateway1_button_text', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Button Text"
            />
            <input
              type="text"
              value={content.gateway1_button_url || ''}
              onChange={(e) => onContentChange('gateway1_button_url', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Button URL"
            />
          </div>
          {/* Image Upload for Gateway 1 - simplified for brevity, ideally reuse upload logic */}
          <div className="relative group w-full h-32">
            <img src={content.gateway1_image_url} alt="Gateway 1" className="w-full h-full rounded-md object-cover shadow-md bg-slate-700" />
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md cursor-pointer">
              <CameraIcon className="w-8 h-8 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'gateway1_image_url')} />
            </label>
          </div>
        </div>
      </div>

      {/* Gateway Card 2 */}
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">Gateway Card 2 (Wholesale)</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={content.gateway2_title || ''}
            onChange={(e) => onContentChange('gateway2_title', e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Card Title"
          />
          <textarea
            value={content.gateway2_description || ''}
            onChange={(e) => onContentChange('gateway2_description', e.target.value)}
            className="w-full h-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Card Description"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={content.gateway2_button_text || ''}
              onChange={(e) => onContentChange('gateway2_button_text', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Button Text"
            />
            <input
              type="text"
              value={content.gateway2_button_url || ''}
              onChange={(e) => onContentChange('gateway2_button_url', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Button URL"
            />
          </div>
          {/* Image Upload for Gateway 2 */}
          <div className="relative group w-full h-32">
            <img src={content.gateway2_image_url} alt="Gateway 2" className="w-full h-full rounded-md object-cover shadow-md bg-slate-700" />
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md cursor-pointer">
              <CameraIcon className="w-8 h-8 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'gateway2_image_url')} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Admin Settings View ---
const AdminSettings: React.FC<{
  logoUrl: string;
  onLogoChange: (newLogo: string) => void;
  backgroundUrl: string | null;
  onBackgroundChange: (newBg: string) => void;
  socialLinks: SocialLinks;
  onSocialLinksChange: (newLinks: SocialLinks) => void;
  openingHours: OpeningHour[];
  onOpeningHoursChange: (newHours: OpeningHour[]) => void;
}> = ({ logoUrl, onLogoChange, backgroundUrl, onBackgroundChange, socialLinks, onSocialLinksChange, openingHours, onOpeningHoursChange }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    supabase.storage.from('images').upload(filePath, file).then(({ error }) => {
      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      callback(data.publicUrl);
    });
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4 font-serif">Site Appearance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Logo Uploader */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-200">Site Logo</h3>
          <div className="relative group w-48 h-48 mx-auto">
            <img src={logoUrl} alt="Current Logo" className="w-full h-full rounded-full object-contain shadow-md bg-slate-700" />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
              aria-label="Change logo"
            >
              <CameraIcon className="w-8 h-8 text-white" />
            </button>
          </div>
          <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, onLogoChange)} className="hidden" accept="image/*" />
          <p className="text-center text-slate-400 text-sm">Hover over the image to change the logo.</p>
        </div>

        {/* Background Uploader */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-200">Homepage Background</h3>
          <div className="relative group w-full h-48">
            {backgroundUrl ? (
              <img src={backgroundUrl} alt="Current Background" className="w-full h-full rounded-md object-cover shadow-md bg-slate-700" />
            ) : (
              <div className="w-full h-full rounded-md bg-slate-700 flex items-center justify-center text-slate-400">No background set</div>
            )}
            <button
              onClick={() => bgInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
              aria-label="Change background image"
            >
              <CameraIcon className="w-8 h-8 text-white" />
            </button>
          </div>
          <input type="file" ref={bgInputRef} onChange={(e) => handleFileChange(e, onBackgroundChange)} className="hidden" accept="image/*" />
          <p className="text-center text-slate-400 text-sm">Hover over the image to change the background.</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t border-slate-700 pt-6 mt-8">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="facebook-url" className="block text-sm font-medium text-slate-400 mb-1">Facebook URL</label>
            <input
              id="facebook-url"
              type="text"
              value={socialLinks?.facebook || ''}
              onChange={(e) => onSocialLinksChange({ ...socialLinks, facebook: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label htmlFor="instagram-url" className="block text-sm font-medium text-slate-400 mb-1">Instagram URL</label>
            <input
              id="instagram-url"
              type="text"
              value={socialLinks?.instagram || ''}
              onChange={(e) => onSocialLinksChange({ ...socialLinks, instagram: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Admin Page Component ---
const AdminPage: React.FC<{
  user: User | null;
  onLogout: () => void;
  products: FishProduct[];
  onAddProduct: (product: Omit<FishProduct, 'id'>) => Promise<void>;
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: FishProduct) => void;
  onToggleVisibility: (id: number) => void;
  onNavigateHome: () => void;
  logoUrl: string;
  onLogoChange: (newLogo: string) => void;
  backgroundUrl: string | null;
  onBackgroundChange: (newBg: string) => void;
  homepageContent: HomepageContent;
  onHomepageContentChange: (field: keyof HomepageContent, value: string) => void;
  socialLinks: SocialLinks;
  onSocialLinksChange: (newLinks: SocialLinks) => void;
  openingHours: OpeningHour[];
  onOpeningHoursChange: (newHours: OpeningHour[]) => void;
}> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
  const [newProductImageUrl, setNewProductImageUrl] = useState<string>('');
  const [newProductCategory, setNewProductCategory] = useState('Fresh Fish');
  const [isNewProductFresh, setIsNewProductFresh] = useState(false);
  const [isNewProductVisible, setIsNewProductVisible] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [adminView, setAdminView] = useState<'dashboard' | 'products' | 'settings' | 'homepage'>('dashboard');

  const categories = ['Fresh Fish', 'Shellfish', 'White Fish', 'Sashimi', 'Other'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProductImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductImageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const fileExt = newProductImageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, newProductImageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return;
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);

    await props.onAddProduct({
      name: newProductName,
      price: newProductPrice,
      image_url: urlData.publicUrl,
      is_fresh: isNewProductFresh,
      is_visible: isNewProductVisible,
      category: newProductCategory
    });

    setNewProductName('');
    setNewProductPrice('');
    setNewProductImageFile(null);
    setNewProductImageUrl('');
    setIsNewProductFresh(false);
    setIsNewProductVisible(true);
    setNewProductCategory('Fresh Fish');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  if (!props.user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          <button onClick={props.onNavigateHome} className="text-slate-400 hover:text-white mb-8">&larr; Back to Home</button>
          <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center font-serif">Admin Login</h2>
            {error && <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-md mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-400">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-400">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-300 disabled:bg-sky-800" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const freshCount = props.products.filter(p => p.is_fresh).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex font-sans">
      <AdminSidebar activeView={adminView} onNavigate={setAdminView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold font-serif capitalize">
              {adminView}
            </h1>
            <div>
              <button onClick={props.onNavigateHome} className="text-slate-400 hover:text-white mr-4">&larr; View Site</button>
              <button onClick={props.onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Logout
              </button>
            </div>
          </div>

          {adminView === 'dashboard' && <AdminDashboard productCount={props.products.length} freshCount={freshCount} />}

          {adminView === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-slate-800 p-6 rounded-lg shadow-2xl self-start">
                <h2 className="text-2xl font-semibold mb-4 font-serif">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label htmlFor="new-product-name" className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                    <input id="new-product-name" type="text" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                  </div>
                  <div>
                    <label htmlFor="new-product-price" className="block text-sm font-medium text-slate-400 mb-1">Product Price</label>
                    <input id="new-product-price" type="text" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                  </div>
                  <div>
                    <label htmlFor="new-product-category" className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                    <select
                      id="new-product-category"
                      value={newProductCategory}
                      onChange={e => setNewProductCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="new-product-image" className="block text-sm font-medium text-slate-400 mb-1">Product Image</label>
                    <input id="new-product-image" type="file" ref={imageInputRef} onChange={handleImageChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 transition-colors" accept="image/*" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is-fresh" checked={isNewProductFresh} onChange={e => setIsNewProductFresh(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500" />
                    <label htmlFor="is-fresh" className="text-sm font-medium text-slate-400">Mark as "Fresh Today"</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is-visible" checked={isNewProductVisible} onChange={e => setIsNewProductVisible(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500" />
                    <label htmlFor="is-visible" className="text-sm font-medium text-slate-400">Show on public site</label>
                  </div>
                  {newProductImageUrl && <img src={newProductImageUrl} alt="Preview" className="mt-2 rounded-md max-h-32 object-contain mx-auto" />}
                  <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-300">Add Product</button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-semibold mb-4 font-serif">Manage Products</h2>
                <div className="overflow-y-auto pr-2">
                  <ProductList products={props.products} isAdmin={true} onDelete={(name) => {
                    const product = props.products.find(p => p.name === name);
                    if (product && product.id) props.onDeleteProduct(product.id)
                  }} onEdit={props.onEditProduct} onToggleVisibility={(id) => props.onToggleVisibility(id)} />
                </div>
              </div>
            </div>
          )}

          {adminView === 'homepage' && (
            <AdminHomepageContent
              content={props.homepageContent}
              onContentChange={props.onHomepageContentChange}
            />
          )}

          {adminView === 'settings' && (
            <AdminSettings
              logoUrl={props.logoUrl}
              onLogoChange={props.onLogoChange}
              backgroundUrl={props.backgroundUrl}
              onBackgroundChange={props.onBackgroundChange}
              socialLinks={props.socialLinks}
              onSocialLinksChange={props.onSocialLinksChange}
              openingHours={props.openingHours}
              onOpeningHoursChange={props.onOpeningHoursChange}
            />
          )}

        </div>
      </main>
    </div>
  );
};

// --- Loading Component ---
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-blue"></div>
  </div>
);


// --- Main App Component ---
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>(INITIAL_LOGO_URL);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [hours, setHours] = useState<OpeningHour[]>(OPENING_HOURS);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ facebook: '', instagram: '' });
  const [page, setPage] = useState<'home' | 'admin'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<FishProduct | null>(null);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Handle URL-based routing
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setPage('admin');
      } else {
        setPage('home');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);

    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData) setProducts(productsData);

      // Fetch settings (logo, background)
      const { data: settingsData, error: settingsError } = await supabase.from('site_settings').select('*').limit(1).single();
      if (settingsData) {
        setLogoUrl(settingsData.logo_url);
        setBackgroundUrl(settingsData.background_url);
        if (settingsData.opening_hours) setHours(settingsData.opening_hours);
        if (settingsData.social_links) setSocialLinks(settingsData.social_links);
      }

      // Fetch homepage content
      const { data: contentData, error: contentError } = await supabase.from('homepage_content').select('*').limit(1).single();
      if (contentData) setHomepageContent(contentData);

      setLoading(false);
    };

    fetchInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        setPage('admin');
        window.history.pushState({}, '', '/admin');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const addProduct = async (product: Omit<FishProduct, 'id'>) => {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (data) {
      setProducts(prev => [data[0], ...prev]);
    }
    if (error) console.error("Error adding product:", error);
  };

  const deleteProduct = async (productId: number) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (originalName: string, updatedProduct: FishProduct) => {
    const { id, ...updateData } = updatedProduct;
    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select();
    if (data) {
      setProducts(prev => prev.map(p => (p.id === id ? data[0] : p)));
    }
    if (error) console.error("Error updating product:", error);
    setEditingProduct(null);
  };

  const toggleProductVisibility = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const { data, error } = await supabase
      .from('products')
      .update({ is_visible: !product.is_visible })
      .eq('id', productId)
      .select();

    if (data) {
      setProducts(prev => prev.map(p => p.id === productId ? data[0] : p));
    }
    if (error) console.error("Error toggling visibility:", error);
  };

  const handleLogoChange = async (newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    await supabase.from('site_settings').update({ logo_url: newLogoUrl }).eq('id', 1);
  };

  const handleBackgroundChange = async (newBgUrl: string) => {
    setBackgroundUrl(newBgUrl);
    await supabase.from('site_settings').update({ background_url: newBgUrl }).eq('id', 1);
  };

  const handleContentChange = async (field: keyof HomepageContent, value: string) => {
    setHomepageContent(prev => ({ ...prev, [field]: value }));
    await supabase.from('homepage_content').update({ [field]: value }).eq('id', 1);
  };

  const handleSocialLinksChange = async (newLinks: SocialLinks) => {
    setSocialLinks(newLinks);
    await supabase.from('site_settings').update({ social_links: newLinks }).eq('id', 1);
  };

  const handleOpeningHoursChange = async (newHours: OpeningHour[]) => {
    setHours(newHours);
    await supabase.from('site_settings').update({ opening_hours: newHours }).eq('id', 1);
  };

  const handleEditClick = useCallback((product: FishProduct) => {
    setEditingProduct(product);
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage('home');
    window.history.pushState({}, '', '/');
  }, []);
  const navigateToAdmin = useCallback(() => {
    setPage('admin');
    window.history.pushState({}, '', '/admin');
  }, []);
  const navigateToHome = useCallback(() => {
    setPage('home');
    window.history.pushState({}, '', '/');
  }, []);

  useEffect(() => {
    const bannerDismissed = sessionStorage.getItem('bannerDismissed');
    if (bannerDismissed || !homepageContent.announcement_text) {
      setIsBannerVisible(false);
    } else {
      setIsBannerVisible(true);
    }
  }, [homepageContent.announcement_text]);

  const handleDismissBanner = () => {
    setIsBannerVisible(false);
    sessionStorage.setItem('bannerDismissed', 'true');
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(lowerTerm));
    }

    // Filter by category
    if (activeFilter !== 'All') {
      if (activeFilter === 'Fresh Today') {
        filtered = filtered.filter(p => p.is_fresh);
      } else {
        filtered = filtered.filter(p => p.category === activeFilter);
      }
    }

    // Filter by visibility (only for public view)
    if (page === 'home') {
      filtered = filtered.filter(p => p.is_visible !== false);
    }

    return filtered;
  }, [products, searchTerm, activeFilter, page]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {page === 'home' && (
        <HomePage
          logoUrl={logoUrl}
          backgroundUrl={backgroundUrl}
          hours={hours}
          content={homepageContent}
          isBannerVisible={isBannerVisible}
          onDismissBanner={handleDismissBanner}
          filteredProducts={filteredProducts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      )}
      {page === 'admin' && (
        <AdminPage
          user={user}
          onLogout={handleLogout}
          products={products}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
          onEditProduct={handleEditClick}
          onToggleVisibility={toggleProductVisibility}
          onNavigateHome={navigateToHome}
          logoUrl={logoUrl}
          onLogoChange={handleLogoChange}
          backgroundUrl={backgroundUrl}
          onBackgroundChange={handleBackgroundChange}
          homepageContent={homepageContent}
          onHomepageContentChange={handleContentChange}
          socialLinks={socialLinks}
          onSocialLinksChange={handleSocialLinksChange}
          openingHours={hours}
          onOpeningHoursChange={handleOpeningHoursChange}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={updateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
};

export default App;