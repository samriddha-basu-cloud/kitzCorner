import { useState } from 'react';
import { Image } from 'lucide-react';

// Image imports remain the same
import img1 from '../assets/img1.jpeg';
import img2 from '../assets/img2.jpeg';
import img3 from '../assets/img3.jpeg';
import img4 from '../assets/img4.jpeg';
import img5 from '../assets/img5.jpeg';
import img6 from '../assets/img6.jpeg';
import img7 from '../assets/img7.jpeg';
import img8 from '../assets/img8.jpeg';
import img9 from '../assets/img9.jpeg';
import img10 from '../assets/img10.jpeg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export const Gallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Image className="h-6 w-6 text-blue-400" />
          <h1 className="text-4xl font-bold text-white tracking-tight">Gallery</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-lg font-semibold">
                    Image {index + 1}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Click to view full size
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;