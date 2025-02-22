import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Orders from "../components/Orders"; // Import the Orders component

const CartItem = ({ item, index, updateQuantity, showDialog }) => {
  const discountedPrice = (
    item.price -
    (item.price * item.discount) / 100
  ).toFixed(2);

  const handleQuantityChange = (change) => {
    if (item.quantity + change === 0) {
      showDialog(item.productId);
    } else {
      updateQuantity(item.productId, change);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden bg-gray-900 border-gray-700 shadow-[0_4px_24px_rgba(0,136,255,0.2)]">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 lg:p-6">
            {/* Product Image and Info */}
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative overflow-hidden rounded-xl bg-gray-800 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {item.discount > 0 && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-2 py-1 rounded-bl-lg text-white">
                    {item.discount}% OFF
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-blue-400">₹{discountedPrice}</span>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">₹{item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-1 sm:space-x-3 mt-4 sm:mt-0">
              <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  className="h-8 w-8 rounded-none text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-10 text-center text-white font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="h-8 w-8 rounded-none text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => showDialog(item.productId)}
                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-gray-800"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          {/* Item Total */}
          <div className="bg-gray-800/50 py-2 px-4 lg:px-6 flex justify-between items-center">
            <span className="text-sm text-gray-400">Item total:</span>
            <span className="text-sm font-medium text-white">
              ₹{(discountedPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ visible: false, productId: null });
  const [showOrders, setShowOrders] = useState(false);
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartCollection = collection(db, "cart");
        const q = query(cartCollection, where("customerId", "==", customerId));
        const cartSnapshot = await getDocs(q);

        if (!cartSnapshot.empty) {
          const cartData = cartSnapshot.docs[0].data();
          setCartItems(cartData.productDetails);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [customerId]);

  const updateQuantity = async (productId, change) => {
    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    );

    setCartItems(updatedItems);

    try {
      const cartCollection = collection(db, "cart");
      const q = query(cartCollection, where("customerId", "==", customerId));
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        const cartDocRef = doc(db, "cart", cartSnapshot.docs[0].id);
        await updateDoc(cartDocRef, {
          productDetails: updatedItems.filter((item) => item.quantity > 0),
        });
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedItems);

    try {
      const cartCollection = collection(db, "cart");
      const q = query(cartCollection, where("customerId", "==", customerId));
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        const cartDocRef = doc(db, "cart", cartSnapshot.docs[0].id);
        await updateDoc(cartDocRef, {
          productDetails: arrayRemove(
            cartItems.find((item) => item.productId === productId)
          ),
        });
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }

    setDialog({ visible: false, productId: null });
  };

  const showDialog = (productId) => {
    setDialog({ visible: true, productId });
  };

  const closeDialog = () => {
    setDialog({ visible: false, productId: null });
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const discountedPrice =
          item.price - (item.price * item.discount) / 100;
        return total + discountedPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const placeOrder = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const orderData = {
        customerId,
        productDetails: cartItems,
        totalAmount: calculateTotal(),
        orderPlaced: true,
        orderPlacedAt: new Date(),
        orderDelivered: false,
        paymentStatus: "Pending",
        orderStatus: "Pending",
      };

      await addDoc(ordersCollection, orderData);

      const cartCollection = collection(db, "cart");
      const q = query(cartCollection, where("customerId", "==", customerId));
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        const cartDocRef = doc(db, "cart", cartSnapshot.docs[0].id);
        await updateDoc(cartDocRef, {
          productDetails: [],
        });
      }

      setCartItems([]);
      setShowOrders(true);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-8 pt-32 md:pt-40 md:px-16 lg:px-24 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          {!showOrders ? (
            <>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-center mb-3 bg-clip-text text-white"
                style={{
                  textShadow:
                    "0 0 6px #66ccff, 0 0 20px #66ccff, 0 0 30px #66ccff, 0 0 40px #0099ff, 0 0 70px #0099ff",
                }}
              >
                Your Cart
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-center text-lg md:text-xl mb-12 max-w-2xl mx-auto"
              >
                {cartItems.length > 0
                  ? `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
                  : "Your cart is empty"}
              </motion.p>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    {cartItems.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {cartItems.map((item, index) => (
                          <CartItem
                            key={item.productId}
                            item={item}
                            index={index}
                            updateQuantity={updateQuantity}
                            showDialog={showDialog}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-64 text-center"
                      >
                        <div className="text-gray-500 text-6xl mb-4">🛒</div>
                        <p className="text-gray-400 mb-6">Your cart is currently empty</p>
                        <Button
                          onClick={() => navigate("/Products")}
                          className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                          Continue Shopping
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {cartItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-12 lg:mt-16"
                    >
                      <Card className="bg-gray-900 border-gray-700 overflow-hidden shadow-[0_4px_24px_rgba(0,136,255,0.15)]">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-gray-700 pb-4">
                              <span className="text-gray-400">Subtotal</span>
                              <span className="text-white font-medium">₹{calculateTotal()}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-4">
                              <span className="text-gray-400">Shipping</span>
                              <span className="text-white font-medium">Free</span>
                            </div>
                            <div className="flex justify-between pt-2">
                              <span className="text-lg font-bold text-white">Total</span>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-400">₹{calculateTotal()}</div>
                                <div className="text-xs text-gray-400">Including taxes</div>
                              </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                              <Button
                                onClick={placeOrder}
                                className="w-full sm:w-auto bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] py-6"
                              >
                                <span className="px-4">Place Order</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </>
              )}
            </>
          ) : (
            <Orders customerId={customerId} />
          )}
        </motion.div>
      </div>

      {dialog.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <Card className="bg-gray-900 border-gray-700 max-w-md w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <CardContent className="p-6">
              <h3 className="text-xl text-white font-bold mb-4">Remove Item</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => removeItem(dialog.productId)}
                  className="bg-red-500/90 hover:bg-red-600 text-white"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
};

export default CartPage;
