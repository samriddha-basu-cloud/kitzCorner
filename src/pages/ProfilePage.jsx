import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";
import WishList from "../components/WishList";
import Orders from "../components/Orders";
import TabNavigation from "../components/TabNavigation";

const ProfilePage = () => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Profile");
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerCollection = collection(db, "customers");
        const q = query(customerCollection, where("customerId", "==", customerId));
        const customerSnapshot = await getDocs(q);

        if (!customerSnapshot.empty) {
          const customerData = customerSnapshot.docs[0].data();
          setCustomerDetails(customerData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  const updateCustomerDetails = async (updatedDetails) => {
    try {
      const customerCollection = collection(db, "customers");
      const q = query(customerCollection, where("customerId", "==", customerId));
      const customerSnapshot = await getDocs(q);

      if (!customerSnapshot.empty) {
        const customerDocRef = doc(db, "customers", customerSnapshot.docs[0].id);
        await updateDoc(customerDocRef, updatedDetails);
        setCustomerDetails(updatedDetails);
      }
    } catch (error) {
      console.error("Error updating customer details:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 md:px-8 lg:px-10 pt-24 md:pt-32 lg:pt-40 pb-16 mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 bg-clip-text text-white"
            style={{
              textShadow:
                "0 0 6px #66ccff, 0 0 20px #66ccff, 0 0 30px #66ccff, 0 0 40px #0099ff, 0 0 70px #0099ff",
            }}
          >
            Your Profile
          </motion.h1>

          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "Profile" && customerDetails && (
                <ProfileForm
                  customerDetails={customerDetails}
                  updateCustomerDetails={updateCustomerDetails}
                />
              )}
              {activeTab === "WishList" && <WishList customerId={customerId} />}
              {activeTab === "Orders" && <Orders customerId={customerId} />}
              {activeTab === "Payment" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <div className="text-gray-500 text-6xl mb-4">💳</div>
                  <p className="text-gray-400 mb-6">Payment details coming soon</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;
