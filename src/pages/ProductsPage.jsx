import React from "react";
import { motion } from "framer-motion";
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
import Navbar from "../components/Navbar";

const ProductCard = ({ title, description, imageUrl, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-blue-300/20"
    >
      <div className="aspect-square overflow-hidden rounded-3xl">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-80 group-hover:opacity-90"
      />
      <div className="absolute bottom-0 w-full p-8">
        <motion.h3
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-white mb-3"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-gray-300 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {description}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" flex mt-4 px-6 py-2 ml-14 items-center justify-center text-center bg-gray-900  border border-blue-300 text-white rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            Shadow:
              "0 0 6px #66ccff, 0 0 20px #66ccff, 0 0 30px #66ccff, 0 0 40px #0099ff, 0 0 70px #0099ff",
          }}
        >
          Learn More
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const products = [
    {
      title: "Product 1",
      description:
        "Experience innovation at its finest with our flagship product, designed to elevate your everyday experience.",
      imageUrl: img1,
    },
    {
      title: "Product 2",
      description:
        "Discover unparalleled performance and style with our premium solution.",
      imageUrl: img2,
    },
    {
      title: "Product 3",
      description:
        "Transform your daily routine with our cutting-edge technology.",
      imageUrl: img3,
    },
    {
      title: "Product 4",
      description:
        "Unleash new possibilities with our advanced features and seamless integration.",
      imageUrl: img4,
    },
    {
      title: "Product 5",
      description:
        "Experience luxury and comfort with our meticulously crafted design.",
      imageUrl: img5,
    },
    {
      title: "Product 6",
      description:
        "Elevate your lifestyle with our innovative and sustainable solution.",
      imageUrl: img6,
    },
    {
      title: "Product 7",
      description:
        "Discover the perfect blend of form and function with our signature product.",
      imageUrl: img7,
    },
    {
      title: "Product 8",
      description:
        "Set new standards with our professional-grade equipment and tools.",
      imageUrl: img8,
    },
    {
      title: "Product 9",
      description:
        "Experience next-level performance with our advanced technology.",
      imageUrl: img9,
    },
    {
      title: "Product 10",
      description:
        "Transform your space with our premium collection of innovative solutions.",
      imageUrl: img10,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="px-8 pt-40 md:px-16 lg:px-24 py-16 bg-gray-900 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl font-bold text-white text-center mb-4"
            style={{
              textShadow:
                "0 0 6px #66ccff, 0 0 20px #66ccff, 0 0 30px #66ccff, 0 0 40px #0099ff, 0 0 70px #0099ff",
            }}
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-center text-xl mb-16 max-w-2xl mx-auto"
          >
            Discover our collection of premium products designed to enhance your
            lifestyle
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                index={index}
                title={product.title}
                description={product.description}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProductsPage;
