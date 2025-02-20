

const images = [
  '../assets/pic1.png',
  '../assets/pic2.png',
  '../assets/pic3.png', // Add more image paths as needed
];

export const Gallery = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Gallery ${index + 1}`} className="w-1/3 h-auto object-cover" />
        ))}
      </div>
    </div>
  );
};