import React from 'react';

interface AboutUsProps {
  text: string;
  image_url: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ text, image_url }) => {
  return (
    <section id="about" className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 md:order-1 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Story</h2>
        <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
          {text}
        </p>
      </div>
      <div className="order-1 md:order-2">
        <img
          src={image_url}
          alt="About Wilsons Seafoods"
          loading="lazy"
          className="rounded-xl shadow-lg w-full h-auto object-cover aspect-[4/3]"
        />
      </div>
    </section>
  );
};

export default AboutUs;