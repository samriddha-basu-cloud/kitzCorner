import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const CategoryToggle = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex justify-center mb-16">
      <div className="bg-gray-800/30 p-3 rounded-full shadow-[inset_-12px_-12px_20px_rgba(255,255,255,0.1),_inset_12px_12px_20px_rgba(0,0,0,0.4)]">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-blue-500/20 text-xl text-blue-400 shadow-[_inset_8px_8px_12px_rgba(0,0,0,0.4),inset_-8px_-8px_12px_rgba(255,255,255,0.1)]"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  // const history = useHistory();
  const navigate = useNavigate();
  const discountedPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden shadow-[16px_16px_32px_rgba(0,0,0,0.4),_-16px_-16px_32px_rgba(255,255,255,0.1)]  "
    >
      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
        {product.discount}% OFF
      </div>
      <div className="aspect-square overflow-hidden rounded-3xl">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-80 group-hover:opacity-90" /> */}
      <div className="absolute bottom-0 w-full p-8 flex justify-between items-end hover:absolute hover:inset-0 hover:bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-80 group-hover:opacity-90 ">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {product.title}
          </h3>
          {/* <p className="text-gray-400 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.description}
          </p> */}
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="mt-4 px-6 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            View Details
          </button>
        </motion.div>
        <div className="flex flex-col items-end">
          <p className="text-gray-300 text-sm line-through">${product.price}</p>
          <p className="text-white text-lg font-semibold">${discountedPrice}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(productsData.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-8 pt-40 md:px-16 lg:px-24 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-4 bg-clip-text text-white "
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <>
              <CategoryToggle
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

CategoryToggle.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  setActiveCategory: PropTypes.func.isRequired,
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProductsPage;
