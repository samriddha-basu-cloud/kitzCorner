import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const WishList = ({ customerId }) => {
  const [wishListItems, setWishListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishListItems = async () => {
      try {
        const wishListCollection = collection(db, "wishlist");
        const q = query(wishListCollection, where("customerId", "==", customerId));
        const wishListSnapshot = await getDocs(q);

        if (!wishListSnapshot.empty) {
          const wishListData = wishListSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data().productDetails,
          }));
          setWishListItems(wishListData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        setLoading(false);
      }
    };

    fetchWishListItems();
  }, [customerId]);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleDeleteItem = async (productId) => {
    try {
      const wishListCollection = collection(db, "wishlist");
      const q = query(wishListCollection, where("customerId", "==", customerId), where("productId", "==", productId));
      const wishListSnapshot = await getDocs(q);

      if (!wishListSnapshot.empty) {
        const docId = wishListSnapshot.docs[0].id;
        await deleteDoc(doc(db, "wishlist", docId));
        setWishListItems(wishListItems.filter((item) => item.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating || 0), 0);
    return totalRating / reviews.length;
  };

  const StarRating = ({ reviews }) => {
    const averageRating = calculateAverageRating(reviews);
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
          />
        ))}
      </div>
    );
  };

  StarRating.propTypes = {
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.string,
        text: PropTypes.string,
        updatedAt: PropTypes.object
      })
    ).isRequired
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8"
      >
        Your WishList
      </motion.h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <>
          {wishListItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {wishListItems.map((item, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,136,255,0.3)] group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-1/4 h-48 sm:h-auto">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {item.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {item.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <StarRating reviews={item.reviews || []} />
                              <span className="text-gray-400 text-xs sm:text-sm">
                                ({item.reviews?.length || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-white text-lg sm:text-xl font-bold">₹{item.price.toFixed(2)}</p>
                            {item.discount > 0 && (
                              <p className="text-gray-400 text-xs sm:text-sm line-through">
                                ₹{((item.price / (1 - item.discount / 100)).toFixed(2))}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4">
                          <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3">
                            <p className="text-gray-400 text-xs">Category</p>
                            <p className="text-white text-sm truncate">{item.category}</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3">
                            <p className="text-gray-400 text-xs">Dimensions</p>
                            <p className="text-white text-sm truncate">{item.dimensions}</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3">
                            <p className="text-gray-400 text-xs">Medium</p>
                            <p className="text-white text-sm truncate">{item.medium}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.availability
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {item.availability ? "In Stock" : "Out of Stock"}
                          </span>
                          
                          <div className="flex w-full sm:w-auto gap-2">
                            <Button
                              onClick={() => handleViewProduct(item.id)}
                              className="flex-1 sm:flex-none bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 text-sm"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex-1 sm:flex-none bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-400 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300 text-sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <div className="text-gray-500 text-6xl mb-4">❤️</div>
              <p className="text-gray-400 mb-6">No items in your wishlist yet</p>
              <Button
                onClick={() => navigate("/Products")}
                className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                Continue Shopping
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

WishList.propTypes = {
  customerId: PropTypes.string.isRequired,
};

export default WishList;