import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const Payments = ({ productDetails, totalAmount, paymentQr, onClose, onPaymentDone }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 p-6 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Payment Details</h2>
          <Button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <XCircle className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {productDetails.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 className="text-white font-medium">{item.name}</h4>
                <p className="text-gray-400">Quantity: {item.quantity}</p>
                <p className="text-gray-400">Price: ₹{item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-white font-bold text-lg">Total Amount: ₹{totalAmount}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <img src={paymentQr} alt="Payment QR" className="w-48 h-48 object-cover" />
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onPaymentDone}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-8 py-4 text-lg rounded-xl transform hover:scale-105"
          >
            Done
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

Payments.propTypes = {
  productDetails: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalAmount: PropTypes.number.isRequired,
  paymentQr: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentDone: PropTypes.func.isRequired,
};

export default Payments;
