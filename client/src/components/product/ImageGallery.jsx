import React, { useState } from 'react';

export const ImageGallery = ({ images = [], productName = 'Saree' }) => {
  const displayImages = images.length > 0 ? images : ['/logo.jpg'];
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails list */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] lg:max-h-[500px] pb-2 md:pb-0 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative w-14 h-18 sm:w-16 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === img
                  ? 'border-gold shadow-gold scale-102'
                  : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/logo.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image */}
      <div className="relative flex-1 aspect-[3/4] max-h-[460px] lg:max-h-[500px] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-md">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover object-center transition-all duration-300"
          onError={(e) => {
            e.target.src = '/logo.jpg';
          }}
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border border-white/20">
          আবু আহমেদ অথেনটিক
        </div>
      </div>
    </div>
  );
};
