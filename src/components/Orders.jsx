import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Package, Clock, Package2, Truck, HomeIcon, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Payments from "./Payments"; // Import the Payments component

const Orders = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const handleCancelOrder = async (orderId) => {
    setCancelLoading(true);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        orderStatus: "Cancelled",
        refund: "requested"
      });

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, orderStatus: "Cancelled", refund: "requested" }
          : order
      ));

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePaymentDone = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paymentStatus: "Pending",
      });

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus: "Pending" }
          : order
      ));

      toast.success("Payment status updated to Pending");
      setSelectedOrder(null); // Close the modal
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case "Received":
        return <Package2 className="w-6 h-6 text-blue-400" />;
      case "Dispatched":
        return <Truck className="w-6 h-6 text-purple-400" />;
      case "Delivered":
        return <HomeIcon className="w-6 h-6 text-green-400" />;
      case "Cancelled":
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getStatusColor = (currentStatus, status) => {
    if (currentStatus === "Cancelled") return "bg-red-500";
    const statusOrder = ["Pending", "Received", "Dispatched", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const statusIndex = statusOrder.indexOf(status);

    return statusIndex <= currentIndex ? "bg-blue-500" : "bg-gray-700";
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Date not available";

    const date = timestamp.toDate();

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
                  <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 overflow-hidden relative group hover:shadow-[0_8px_32px_rgba(0,136,255,0.3)] transition-all duration-500">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                      order.orderStatus === "Cancelled"
                        ? "from-red-500 via-red-400 to-red-500"
                        : "from-blue-500 via-purple-500 to-pink-500"
                    }`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col space-y-6 sm:space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Order ID</p>
                            <h3 className="text-lg font-bold text-white font-mono bg-gray-800/50 px-3 py-1 rounded-md">{order.id}</h3>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-sm text-gray-400 mb-1">Order Date</p>
                            <p className="text-base text-white bg-gray-800/50 px-3 py-1 rounded-md">
                              {formatDate(order.orderPlacedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="relative py-4">
                          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-700 -translate-y-1/2"></div>
                          <div className="relative flex justify-between">
                            {["Pending", "Received", "Dispatched", "Delivered"].map((status) => (
                              <div key={status} className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full ${getStatusColor(order.orderStatus, status)} flex items-center justify-center border-4 border-gray-900 relative z-10 shadow-lg transition-all duration-300`}>
                                  {getStatusIcon(status)}
                                </div>
                                <p className="text-sm text-gray-400 mt-2 font-medium">{status}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-700/50 pt-6">
                          <p className="text-base text-gray-400">Total Amount</p>
                          <p className="text-2xl font-bold text-white bg-blue-500/10 px-4 py-2 rounded-lg">₹{order.totalAmount}</p>
                        </div>

                        <div className="space-y-4">
                          {order.productDetails.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-4 sm:space-x-6 bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/60 transition-colors duration-300 group/item"
                            >
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg ring-2 ring-gray-700/50 group-hover/item:ring-blue-500/50 transition-all duration-300"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-base sm:text-lg text-white font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-400 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <p className="text-base sm:text-lg text-gray-300 font-medium">₹{item.price} x {item.quantity}</p>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 pt-4">
                          {/* Payment Button */}
                          <Button
                            disabled={order.paymentStatus === "Pending" || order.orderStatus === "Cancelled" || order.paymentStatus === "Success" || order.paymentStatus === "Failed"}
                            onClick={() => setSelectedOrder(order)}
                            className={`flex-1 sm:flex-none px-8 py-4 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                              order.paymentStatus === "Pending" || order.orderStatus === "Cancelled"
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-70"
                                : order.paymentStatus === "Success" && order.orderStatus === "Cancelled" && order.refund === "complete"
                                ? "bg-green-500 text-white shadow-lg hover:shadow-green-500/25"
                                : order.paymentStatus === "Success" && order.orderStatus === "Cancelled"
                                ? "bg-purple-500 text-white shadow-lg hover:shadow-purple-500/25"
                                : order.paymentStatus === "Success"
                                ? "bg-green-500 text-white shadow-lg hover:shadow-green-500/25"
                                : order.paymentStatus === "Failed"
                                ? "bg-red-500 text-white shadow-lg hover:shadow-red-500/25"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/25"
                            }`}
                          >
                            {order.paymentStatus === "Pending"
                              ? "Waiting for Admin's Approval"
                              : order.paymentStatus === "Success" && order.orderStatus === "Cancelled" && order.refund === "complete"
                              ? "Refund Complete"
                              : order.paymentStatus === "Success" && order.orderStatus === "Cancelled"
                              ? "Refund Requested"
                              : order.paymentStatus === "Success"
                              ? "Successfully Paid"
                              : order.paymentStatus === "Failed"
                              ? "Payment Failed"
                              : "Make Payment"}
                          </Button>

                          {/* Cancel Order Button & Dialog */}
                          {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="flex-1 sm:flex-none px-8 py-4 text-base font-medium rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105"
                                >
                                  Cancel Order
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-900 border border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Cancel Order</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    Are you sure you want to cancel this order? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                                    No, keep order
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={cancelLoading}
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    {cancelLoading ? "Cancelling..." : "Yes, cancel order"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>

                        {/* Cancelled Status Display */}
                        {order.orderStatus === "Cancelled" && (
                          <div className="flex items-center justify-center bg-red-500/10 rounded-lg p-4 mt-4">
                            <XCircle className="w-5 h-5 text-red-400 mr-2" />
                            <span className="text-red-400 font-medium">Order Cancelled</span>
                          </div>
                        )}

                        {/* Refund Complete Display */}
                        {order.orderStatus === "Cancelled" && order.refund === "complete" && (
                          <div className="flex items-center justify-center bg-green-500/10 rounded-lg p-4 mt-4">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-green-400 font-medium">Refund Complete</span>
                          </div>
                        )}
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
              <Package className="w-16 h-16 text-gray-500 mb-4" />
              <p className="text-gray-400 text-xl mb-8">No orders yet</p>
              <Button
                onClick={() => navigate("/Products")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-8 py-6 text-lg rounded-xl transform hover:scale-105"
              >
                Continue Shopping
              </Button>
            </motion.div>
          )}
        </>
      )}
      {selectedOrder && (
        <Payments
          productDetails={selectedOrder.productDetails}
          totalAmount={selectedOrder.totalAmount}
          paymentQr={selectedOrder.paymentQr}
          onClose={() => setSelectedOrder(null)}
          onPaymentDone={() => handlePaymentDone(selectedOrder.id)}
        />
      )}
    </div>
  );
};

Orders.propTypes = {
  customerId: PropTypes.string.isRequired,
};

export default Orders;
