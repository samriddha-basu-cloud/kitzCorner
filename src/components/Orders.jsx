import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle } from "lucide-react";

const Orders = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const q = query(ordersCollection, where("customerId", "==", customerId));
        const ordersSnapshot = await getDocs(q);

        if (!ordersSnapshot.empty) {
          const ordersData = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 tracking-tight"
      >
        Your Orders
      </motion.h2>
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  {...fadeInUp}
                >
                  <Card className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 overflow-hidden relative hover:shadow-[0_8px_32px_rgba(0,136,255,0.3)] transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col space-y-4 sm:space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Order ID</p>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white font-mono">{order.id}</h3>
                          </div>
                          <div className="flex items-center space-x-2 bg-blue-500/10 px-2 sm:px-4 py-1 sm:py-2 rounded-full">
                            {order.orderPlaced ?
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /> :
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            }
                            <span className="text-sm sm:text-base text-gray-300">{order.orderPlaced ? "Placed" : "Pending"}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-700/50 pt-4 sm:pt-6">
                          <p className="text-sm sm:text-base text-gray-400">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">₹{order.totalAmount}</p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          {order.productDetails.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3 sm:space-x-6 bg-gray-800/50 rounded-xl p-3 sm:p-4 hover:bg-gray-800/70 transition-colors duration-200"
                            >
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg ring-1 ring-gray-700/50"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-sm sm:text-base text-white font-medium">{item.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <p className="text-sm sm:text-base text-gray-300">₹{item.price} x {item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 sm:h-96 text-center"
            >
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-3 sm:mb-4" />
              <p className="text-gray-400 text-lg sm:text-xl mb-6 sm:mb-8">No orders yet</p>
              <Button
                onClick={() => navigate("/Products")}
                className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
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

Orders.propTypes = {
  customerId: PropTypes.string.isRequired,
};

export default Orders;