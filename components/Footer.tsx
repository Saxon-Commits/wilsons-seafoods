import React from 'react';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-slate-400 hover:text-brand-blue transition-colors duration-300">
    {children}
  </a>
);

const Footer: React.FC<{ socialLinks?: { facebook: string; instagram: string; }, abn?: string, phoneNumber?: string }> = ({ socialLinks, abn, phoneNumber }) => {
  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Wilson's Seafoods</h3>
            <p className="mt-2 text-slate-400">Freshness you can taste, from our shores to your table.</p>
            {abn && <p className="mt-2 text-sm text-slate-500">ABN: {abn}</p>}
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Contact Us</h3>
            <div className="mt-2 space-y-1 text-slate-400">
              <p>5 Sussex St, Glenorchy TAS 7010</p>
              <p>Phone: {phoneNumber || '(03) 6272 6600'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Follow Us</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              <SocialIcon href={socialLinks?.facebook || "#"}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href={socialLinks?.instagram || "#"}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.545a3.37 3.37 0 00-3.37 3.37v5.454a3.37 3.37 0 003.37 3.37h5.454a3.37 3.37 0 003.37-3.37V6.915a3.37 3.37 0 00-3.37-3.37H11.154zM12 8.35a3.65 3.65 0 100 7.3 3.65 3.65 0 000-7.3z" clipRule="evenodd" /><path d="M16.95 6.915a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" /></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Wilson's Seafoods. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;