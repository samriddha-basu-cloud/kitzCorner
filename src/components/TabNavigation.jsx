import { motion } from "framer-motion";
import { User, Heart, Box, CreditCard } from "lucide-react";
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: "Profile", icon: <User size={20} /> },
    { label: "WishList", icon: <Heart size={20} /> },
    { label: "Orders", icon: <Box size={20} /> },
    { label: "Payment", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="flex justify-center space-x-4 md:space-x-6 mb-8 overflow-x-auto">
      {tabs.map((tab, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex flex-col items-center space-y-1 px-3 py-2 cursor-pointer ${
            activeTab === tab.label
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.icon}
          <span className="text-xs md:text-sm">{tab.label}</span>
        </motion.div>
      ))}
    </div>
  );
};



TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};


export default TabNavigation;
