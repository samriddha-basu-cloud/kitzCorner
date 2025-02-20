import { useEffect } from "react";
import { gsap } from "gsap";
import { Image } from "lucide-react";

// Image imports remain the same
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";
import img7 from "../assets/img7.jpeg";
import img8 from "../assets/img8.jpeg";
import img9 from "../assets/img9.jpeg";
import img10 from "../assets/img10.jpeg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export const Gallery = () => {
  useEffect(() => {
    // GSAP animation for the heading
    gsap.to(".gallery-heading", {
      opacity: 1,
      y: -50,
      duration: 1,
      ease: "power2.out",
    });

    // GSAP animation for the pictures
    gsap.to(".gallery-item", {
      opacity: 1,
      y: 50,
      duration: 1,
      ease: "power2.out",
      // stagger: 0.2,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12 gallery-heading">
          <Image className="h-8 w-8 text-blue-400" />
          <h1
            className="text-4xl font-bold text-white tracking-tight"
            style={{
              textShadow:
                "0 0 3px #66ccff, 0 0 20px #66ccff, 0 0 30px #66ccff, 0 0 40px #0099ff, 0 0 70px #0099ff",
            }}
          >
            Gallery
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl break-inside-avoid gallery-item"
              style={{ gridRowEnd: `span ${Math.ceil(Math.random() * 3)}` }}
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
