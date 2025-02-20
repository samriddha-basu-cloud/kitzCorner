import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const navItems = ["Home", "Gallery", "Contacts", "Products"];
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white p-4 shadow-lg fixed top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">SB</h1>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <motion.li
              key={item}
              className="relative cursor-pointer text-lg font-medium px-4 py-2"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {item}
              {active === item && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;