import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Star, Search, Heart } from "lucide-react";

const CategoryToggle = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto py-3 max-w-full px-1">
      <div className="bg-gray-800/30 p-1.5 md:p-2 rounded-full shadow-[inset_-8px_-8px_16px_rgba(255,255,255,0.1),_inset_8px_8px_16px_rgba(0,0,0,0.4)]">
        <div className="flex space-x-1 md:space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === category
                  ? "bg-blue-500/20 text-blue-400 shadow-[_inset_6px_6px_10px_rgba(0,0,0,0.4),inset_-6px_-6px_10px_rgba(255,255,255,0.1)]"
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

const AvailabilityToggle = ({ showOnlyInStock, setShowOnlyInStock }) => {
  return (
    <div className="flex justify-center mb-6 md:mb-8">
      <div
        onClick={() => setShowOnlyInStock(!showOnlyInStock)}
        className="flex items-center bg-gray-800/30 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.1),_inset_4px_4px_8px_rgba(0,0,0,0.4)] cursor-pointer"
      >
        <span className="text-gray-300 text-xs md:text-sm mr-2 md:mr-3">Show only in stock</span>
        <div
          className={`relative w-10 md:w-12 h-5 md:h-6 rounded-full transition-all duration-300 ${
            showOnlyInStock ? "bg-blue-500/30" : "bg-gray-700/50"
          }`}
        >
          <motion.div
            animate={{ x: showOnlyInStock ? 20 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-1 w-3 md:w-4 h-3 md:h-4 rounded-full shadow-md ${
              showOnlyInStock
                ? "bg-blue-400"
                : "bg-gray-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const numRating = Number(rating) || 0;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < numRating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, index, wishlist, setWishlist }) => {
  const navigate = useNavigate();
  const discountedPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toFixed(2);

  const averageRating = product.reviews
    ? product.reviews.reduce((acc, review) => acc + Number(review.rating), 0) / product.reviews.length
    : 0;

  const isWishlisted = wishlist.some((item) => item.productId === product.id);

  const handleWishlist = async () => {
    const customerId = localStorage.getItem("customerId");
    const customerDoc = await getDoc(doc(db, "customers", customerId));
    const customerName = customerDoc.data().name;

    if (isWishlisted) {
      // Remove from wishlist
      const wishlistItem = wishlist.find((item) => item.productId === product.id);
      await deleteDoc(doc(db, "wishlist", wishlistItem.id));
      setWishlist(wishlist.filter((item) => item.productId !== product.id));
    } else {
      // Add to wishlist
      await addDoc(collection(db, "wishlist"), {
        customerId,
        customerName,
        productId: product.id,
        productDetails: product,
      });
      setWishlist([...wishlist, { customerId, customerName, productId: product.id, productDetails: product }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[12px_12px_24px_rgba(0,0,0,0.4),_-6px_-6px_16px_rgba(255,255,255,0.05)]"
    >
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs md:text-xs font-semibold text-xs">
          {product.discount}% OFF
        </div>
      )}

      <div className="aspect-square overflow-hidden rounded-t-2xl md:rounded-t-3xl">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={product.images?.[0] || product.image}
          alt={product.title || product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 md:p-6 bg-gray-800/80 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <h3 className="text-sm md:text-xl font-bold text-white truncate pr-2">
            {product.title || product.name}
          </h3>
          <div className="flex flex-col items-end">
            {product.discount > 0 && (
              <p className="text-gray-400 text-xs line-through">₹{product.price}</p>
            )}
            <p className="text-white text-sm md:text-lg font-semibold">₹{discountedPrice}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1 md:mt-3">
          {product.reviews && product.reviews.length > 0 ? (
            <div className="flex items-center">
              <StarRating rating={averageRating} />
              <span className="text-gray-400 text-xs ml-1 md:ml-2">({product.reviews.length})</span>
            </div>
          ) : (
            <span className="text-gray-500 text-xs">No reviews</span>
          )}
        </div>

        {product.availability !== undefined && (
          <div className={`mt-1 md:mt-2 inline-flex items-center text-xs font-medium ${
            product.availability
              ? "text-green-400"
              : "text-red-400"
          }`}>
            <span className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-1 md:mr-1.5 ${
              product.availability ? "bg-green-400" : "bg-red-400"
            }`}></span>
            {product.availability ? "In Stock" : "Out of Stock"}
          </div>
        )}

        <div className="flex gap-1 md:gap-2 mt-2 md:mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 py-1 md:py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 hover:bg-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          >
            View
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlist}
            className={`p-1 md:p-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 text-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 hover:bg-gray-600/50 ${
              isWishlisted ? "text-red-500" : ""
            }`}
          >
            <Heart size={16} fill={isWishlisted ? "red" : "none"} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery === "") {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-6 md:mb-10 max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleChange}
          className="w-full py-2 md:py-3 px-4 md:px-5 pl-10 md:pl-12 bg-gray-800/30 rounded-full text-white placeholder-gray-500 focus:outline-none shadow-[inset_-6px_-6px_10px_rgba(255,255,255,0.05),_inset_6px_6px_10px_rgba(0,0,0,0.3)]"
        />
        <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <button
          type="submit"
          className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/40 text-blue-300 rounded-full py-1 md:py-1.5 px-3 md:px-4 text-xs md:text-sm hover:bg-blue-500/40 transition-all duration-300"
        >
          Search
        </button>
      </div>
    </form>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [ setCustomerName] = useState("");

  useEffect(() => {
    const fetchCustomerId = () => {
      const id = localStorage.getItem("customerId");
      setCustomerId(id);
    };

    fetchCustomerId();
  }, []);

  useEffect(() => {
    if (customerId) {
      const fetchCustomerName = async () => {
        try {
          const customerDoc = await getDoc(doc(db, "customers", customerId));
          if (customerDoc.exists()) {
            setCustomerName(customerDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching customer name:", error);
        }
      };

      fetchCustomerName();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (customerId) {
        try {
          const wishlistCollection = collection(db, "wishlist");
          const wishlistQuery = query(wishlistCollection, where("customerId", "==", customerId));
          const wishlistSnapshot = await getDocs(wishlistQuery);
          const wishlistData = wishlistSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWishlist(wishlistData);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };

    fetchWishlist();
  }, [customerId]);

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
          ...new Set(productsData.map((product) => product.category).filter(Boolean)),
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

  // Filter products by category, search query and availability
  const filteredProducts = products
    .filter(product => activeCategory === "All" || product.category === activeCategory)
    .filter(product => {
      if (!searchQuery) return true;

      const search = searchQuery.toLowerCase();
      return (
        (product.title?.toLowerCase().includes(search) || product.name?.toLowerCase().includes(search)) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
      );
    })
    .filter(product => !showOnlyInStock || product.availability === true);

  // Clear search handler
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-3 sm:px-8 pt-28 md:pt-40 lg:px-24 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-center mb-2 md:mb-4 text-white"
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
            className="text-gray-400 text-center text-sm md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto"
          >
            Discover our collection of premium products designed to enhance your
            lifestyle
          </motion.p>

          <SearchBar onSearch={setSearchQuery} onClear={handleClearSearch} />

          <AvailabilityToggle
            showOnlyInStock={showOnlyInStock}
            setShowOnlyInStock={setShowOnlyInStock}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 md:w-20 h-16 md:h-20">
                <div className="absolute top-0 left-0 w-full h-full border-3 md:border-4 border-t-blue-400 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                <div className="absolute top-1 md:top-2 left-1 md:left-2 w-14 md:w-16 h-14 md:h-16 border-3 md:border-4 border-t-transparent border-b-blue-300/70 border-l-transparent border-r-transparent rounded-full animate-spin animation-delay-200"></div>
              </div>
            </div>
          ) : (
            <>
              <CategoryToggle
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />

              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:py-16"
                >
                  <h3 className="text-xl md:text-2xl text-gray-300 mb-2 md:mb-4">No products found</h3>
                  <p className="text-gray-500 text-sm md:text-base">Try adjusting your search or category filter</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCategory}-${searchQuery}-${showOnlyInStock}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8"
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        wishlist={wishlist}
                        setWishlist={setWishlist}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

AvailabilityToggle.propTypes = {
  showOnlyInStock: PropTypes.bool.isRequired,
  setShowOnlyInStock: PropTypes.func.isRequired,
};

StarRating.propTypes = {
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CategoryToggle.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  setActiveCategory: PropTypes.func.isRequired,
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    description: PropTypes.string,
    availability: PropTypes.bool,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.string,
        text: PropTypes.string,
      })
    ),
  }).isRequired,
  index: PropTypes.number.isRequired,
  wishlist: PropTypes.array.isRequired,
  setWishlist: PropTypes.func.isRequired,
};

export default ProductsPage;
