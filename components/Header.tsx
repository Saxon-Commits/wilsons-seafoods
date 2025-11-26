import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  logo: string;
}

const NavLink: React.FC<{ href: string, children: React.ReactNode, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }> = ({ href, children, onClick }) => {
  const isExternal = href.startsWith('http');
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        className="text-slate-200 hover:text-brand-gold transition-colors duration-300 pb-1 border-b-2 border-transparent hover:border-brand-gold text-lg md:text-base font-medium"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    </li>
  );
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 120;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    closeMenu();
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      {/* Glassmorphism Background Wrapper */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-900 to-slate-900 border-b border-white/10 shadow-lg"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <a href="#" className="flex items-center space-x-4 md:space-x-6 group">
            <div className="flex-shrink-0 transform transition-transform group-hover:scale-105 duration-300">
              <img
                src={logo}
                alt="Wilsons Seafoods Logo"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full shadow-lg object-contain bg-white/5 border border-white/10 p-1.5 backdrop-blur-sm"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-white group-hover:text-brand-blue transition-colors">
                Wilsons Seafoods
              </h1>
              <div className="mt-1 text-sm text-slate-300 hidden sm:block flex flex-col">
                <span className="flex items-center gap-1">
                  5 Sussex St, Glenorchy
                </span>
                <span className="text-brand-gold font-semibold">6272 6600</span>
              </div>
            </div>
          </a>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <NavLink href="https://app.fresho.com/wilsons-seafoods">Wholesale</NavLink>
              <NavLink href="#about" onClick={handleNavClick}>About Us</NavLink>
              <NavLink href="#contact" onClick={handleNavClick}>Contact</NavLink>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu" className="text-slate-200 hover:text-brand-gold transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-gradient-to-br from-blue-700 to-blue-900 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-end p-6">
          <button onClick={closeMenu} aria-label="Close menu" className="text-slate-300 hover:text-brand-gold">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-16">
          <ul className="flex flex-col items-center space-y-8 font-serif text-2xl">
            <NavLink href="https://app.fresho.com/wilsons-seafoods">Wholesale</NavLink>
            <NavLink href="#about" onClick={handleNavClick}>About Us</NavLink>
            <NavLink href="#contact" onClick={handleNavClick}>Contact</NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;