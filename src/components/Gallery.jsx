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
    gsap.fromTo(
      ".gallery-item",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
      }
    );

    // GSAP hover animation for the pictures
    gsap.utils.toArray(".gallery-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        gsap.to(item, { scale: 1.05, duration: 0.5, ease: "power2.inOut" });
      });
      item.addEventListener("mouseleave", () => {
        gsap.to(item, { scale: 1, duration: 0.5, ease: "power2.inOut" });
      });
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

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl break-inside-avoid gallery-item neomorphic"
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

      {/* Custom CSS for Neomorphic Design with updated shadows */}
      <style>{`
        .neomorphic {
          background: #1e293b; /* Matching slate-900 background */
          border-radius: 15px;
          box-shadow: 20px 20px 60px #171e2e, -20px -20px 60px #253448; /* Darker and lighter variants of the background */
          transition: transform 0.3s ease-in-out;
        }

        .neomorphic:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Gallery;