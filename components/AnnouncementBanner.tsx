import React from 'react';

interface AnnouncementBannerProps {
  text: string;
  onDismiss: () => void;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ text, onDismiss }) => {
  return (
    <div className="bg-brand-blue text-white font-semibold p-3 text-center text-md relative z-30">
      <p className="pr-8">{text}</p>
      <button
        onClick={onDismiss}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white"
        aria-label="Dismiss announcement"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default AnnouncementBanner;