import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, arrayUnion, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const swiperRef = useRef(null);

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
    const customerId = localStorage.getItem("customerId");
    if (!customerId || !product) {
      console.error("Customer ID or product data not found");
      return;
    }

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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const discountedPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toFixed(2);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-40 px-8 py-16">
        <div className="max-w-6xl mx-auto bg-gray-800/30 p-8 rounded-3xl shadow-[16px_16px_32px_rgba(0,0,0,0.4),_-16px_-16px_32px_rgba(255,255,255,0.1)] flex flex-col lg:flex-row">
          {/* Image Gallery */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 relative">
            <Swiper
              pagination={{ dynamicBullets: true }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
              ref={swiperRef}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - ${index}`}
                    className="w-full h-auto rounded-3xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-6 rounded-full text-white"></div>
            <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-6 rounded-full text-white"></div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 lg:pl-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {product.name}
            </h2>
            <div className="flex items-center mb-4">
              <p className="text-gray-300 text-2xl line-through mr-4">
                ₹{product.price}
              </p>
              <p className="text-white text-3xl font-semibold">
                ₹{discountedPrice}
              </p>
              <p className="text-red-500 text-lg ml-4">
                ({product.discount}% OFF)
              </p>
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              {product.description}
            </p>
            <button
              onClick={addToCart}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
