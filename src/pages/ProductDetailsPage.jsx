import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, arrayUnion, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { ShoppingCart, Clock, Star, Info, CheckCircle, XCircle } from "lucide-react";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const swiperRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDocRef = doc(db, "products", productId);
        const productDocSnap = await getDoc(productDocRef);

        if (productDocSnap.exists()) {
          setProduct({ id: productDocSnap.id, ...productDocSnap.data() });
        } else {
          console.log("No such product!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    const fetchCustomerName = async () => {
      const customerId = localStorage.getItem("customerId");
      if (customerId) {
        const customerDocRef = doc(db, "customers", customerId);
        const customerDocSnap = await getDoc(customerDocRef);
        if (customerDocSnap.exists()) {
          setCustomerName(customerDocSnap.data().name);
        } else {
          console.log("No such customer!");
        }
      }
    };

    fetchProduct();
    fetchCustomerName();
  }, [productId]);

  const addToCart = async () => {
    setAddingToCart(true);
    const customerId = localStorage.getItem("customerId");
    if (!customerId || !product) {
      console.error("Customer ID or product data not found");
      setAddingToCart(false);
      return;
    }

    try {
      const cartCollectionRef = collection(db, "cart");
      const cartQuery = query(cartCollectionRef, where("customerId", "==", customerId));
      const cartQuerySnapshot = await getDocs(cartQuery);

      const productDetails = {
        productId: product.id,
        discount: product.discount,
        image: product.images[0],
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      if (!cartQuerySnapshot.empty) {
        // Cart document exists, update it
        const cartDocRef = doc(db, "cart", cartQuerySnapshot.docs[0].id);
        const cartDocData = cartQuerySnapshot.docs[0].data();

        const updatedTotalAmount = (
          parseFloat(cartDocData.totalAmount) + parseFloat(discountedPrice)
        ).toFixed(2);

        await updateDoc(cartDocRef, {
          productDetails: arrayUnion(productDetails),
          totalAmount: updatedTotalAmount,
        });
      } else {
        // Cart document does not exist, create it
        await setDoc(doc(cartCollectionRef), {
          customerId: customerId,
          name: customerName,
          productDetails: [productDetails],
          totalAmount: discountedPrice,
          orderPlaced: false,
        });
      }
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + Number(review.rating), 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-blue-400 mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3),_0_-2px_6px_rgba(255,255,255,0.1)]">
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400">The product you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const discountedPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toFixed(2);
  
  const averageRating = calculateAverageRating(product.reviews || []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800 pt-28 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
           {/* Breadcrumbs */}
          <div className="text-sm text-gray-400 mb-6 flex items-center">
            <span 
              className="hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => navigate('/Home')}
            >
              Home
            </span>
            <span className="mx-2">➤</span>
            <span 
              className="hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => navigate('/Products')}
            >
              Products
            </span>
            <span className="mx-2">➤</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">{product.category}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-400">{product.name}</span>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3),_0_-2px_10px_rgba(255,255,255,0.07)]">
            <div className="flex flex-col lg:flex-row">
              {/* Image Gallery - Left Section */}
              <div className="lg:w-3/5 relative bg-gradient-to-br from-gray-800/50 to-gray-900/70">
                <div className="p-6 lg:p-8">
                  <Swiper
                    pagination={{ 
                      dynamicBullets: true,
                      clickable: true
                    }}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="product-swiper rounded-2xl overflow-hidden"
                    ref={swiperRef}
                  >
                    {product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative overflow-hidden rounded-2xl group">
                          <img
                            src={image}
                            alt={`${product.name} - ${index}`}
                            className="w-full h-auto rounded-2xl object-cover transform transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  <div className="swiper-button-next !w-12 !h-12 !flex items-center justify-center rounded-full backdrop-blur-md text-white shadow-lg !after:content-[''] top-1/2 -right-6 lg:right-4 transition-colors">
                  </div>
                  <div className="swiper-button-prev !w-12 !h-12 !flex items-center justify-center rounded-full backdrop-blur-md text-white shadow-lg !after:content-[''] top-1/2 -left-6 lg:left-4 transition-colors">
                  </div>
                </div>
              </div>

              {/* Product Details - Right Section */}
              <div className="lg:w-2/5 p-6 lg:p-10 bg-gradient-to-br from-gray-800/30 to-gray-900/50">
                <div className="h-full flex flex-col">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.discount > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                        {product.discount}% OFF
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                      {product.category}
                    </span>
                    {product.availability ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                        <XCircle className="w-3 h-3 mr-1" /> Out of Stock
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                    {product.name}
                  </h1>

                  {/* Reviews */}
                  <div className="flex items-center mt-1 mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-yellow-400' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">
                      {averageRating} ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      ₹{discountedPrice}
                    </p>
                    {product.discount > 0 && (
                      <>
                        <p className="text-gray-400 text-lg line-through ml-3">
                          ₹{product.price}
                        </p>
                        <div className="ml-3 px-2 py-1 rounded bg-red-500/20 text-red-300 text-sm font-medium">
                          Save ₹{(product.price - discountedPrice).toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Art Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-700/20 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Medium</span>
                      <span className="text-white font-medium mt-1">{product.medium || "Not specified"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Dimensions</span>
                      <span className="text-white font-medium mt-1">{product.dimensions || "Not specified"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Category</span>
                      <span className="text-white font-medium mt-1">{product.category}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Created</span>
                      <span className="text-white font-medium mt-1">
                        {product.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-sm prose-invert mb-6 text-gray-300 leading-relaxed">
                    <p>{product.description}</p>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center text-gray-400 text-sm mb-8">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Delivery within 10-15 business days</span>
                  </div>

                  {/* Add to Cart Button - Push to bottom with mt-auto */}
                  <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={addToCart}
                        disabled={addingToCart || !product.availability}
                        className={`flex-1 px-6 py-4 flex items-center justify-center rounded-xl text-lg font-medium transition-all relative overflow-hidden group ${
                          !product.availability 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : addedToCart 
                              ? "bg-green-500 text-white" 
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_20px_rgba(59,130,246,0.5)]"
                        }`}
                      >
                        {!product.availability ? (
                          <span className="flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            Out of Stock
                          </span>
                        ) : (
                          <>
                            <span className={`flex items-center transition-transform duration-300 ${addedToCart ? "-translate-y-24" : "translate-y-0"}`}>
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </span>
                            <span className={`absolute flex items-center transition-transform duration-300 ${addedToCart ? "translate-y-0" : "translate-y-24"}`}>
                              ✓ Added to Cart
                            </span>
                          </>
                        )}
                        {addingToCart && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </button>
                      
                      <button className="sm:w-16 h-14 flex items-center justify-center rounded-xl bg-gray-700/50 text-white border border-gray-600/50 hover:bg-gray-700 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-12 bg-gray-800/30 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2),_0_-1px_8px_rgba(255,255,255,0.05)]">
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400 fill-yellow-400" />
                Customer Reviews
              </h3>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Reviews summary */}
                  <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-700/50">
                    <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl">
                      <div className="text-5xl font-bold text-white mb-2">{averageRating}</div>
                      <div className="flex text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-400' : ''}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm">Based on {product.reviews.length} reviews</p>
                    </div>
                    
                    <div className="md:w-2/3 flex flex-col justify-center">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = product.reviews.filter(r => Number(r.rating) === rating).length;
                        const percentage = product.reviews.length ? (count / product.reviews.length) * 100 : 0;
                        
                        return (
                          <div key={rating} className="flex items-center mb-2">
                            <div className="flex items-center w-16">
                              <span className="text-sm text-gray-400 mr-2">{rating}</span>
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden mx-2">
                              <div 
                                className="h-full bg-yellow-400 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Individual reviews */}
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="p-5 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {`C ${index+1}`}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-white font-medium">Customer : {index+1}</h4>
                            <div className="flex text-yellow-400 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Number(review.rating) ? 'fill-yellow-400' : ''}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="ml-auto text-gray-500 text-sm">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">No Reviews Yet</h4>
                  <p className="text-gray-400 max-w-md">
                    Be the first to review this product and help other customers make their decision!
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional product details section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2),_0_-1px_4px_rgba(255,255,255,0.05)]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Secure Payment</h3>
              </div>
              <p className="text-gray-400 text-sm">All transactions are secure and encrypted for your protection.</p>
            </div>
            
            <div className="bg-gray-800/30 p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2),_0_-1px_4px_rgba(255,255,255,0.05)]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Fast Delivery</h3>
              </div>
              <p className="text-gray-400 text-sm">Quick shipping and delivery. Track your package in real-time.</p>
            </div>
            
            <div className="bg-gray-800/30 p-6 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2),_0_-1px_4px_rgba(255,255,255,0.05)]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Satisfied Customers</h3>
              </div>
              <p className="text-gray-400 text-sm">Positive reviews from satisfied customers.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;