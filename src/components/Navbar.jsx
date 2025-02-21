import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/app_icon_kitzcorner.png";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["Home", "Products", "Cart"];
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the active nav item based on the current path
    const path = location.pathname.split("/")[1];
    if (navItems.includes(path)) {
      setActive(path);
    } else {
      setActive("Home");
    }
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleItemClick = (item) => {
    setActive(item);
    setIsOpen(false);
    navigate(`/${item}`);
  };

  return (
    <nav className="w-full bg-gray-900 text-white p-4 shadow-lg fixed top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
       <div className="relative flex items-center justify-center space-x-4">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 via-indigo-400/30 to-blue-500/30 blur-xl opacity-75"></div>
          <img
            src={Logo}
            alt="Kitzcorner"
            className="relative h-16 w-16 object-contain drop-shadow-lg"
          />
          <p className="relative text-gray-200 text-xl font-extrabold font-serif">
            KitzCorner
          </p>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
  {navItems.map((item) => (
    <motion.li
      key={item}
      className="relative cursor-pointer text-lg font-medium px-4 py-2 group"
      onClick={() => handleItemClick(item)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-400/30 to-blue-500/30 
        blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300
        ${active === item ? 'opacity-75' : ''}`}>
      </div>
      <span className="relative">{item}</span>
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

        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:block ml-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
            shadow-lg hover:bg-red-700 hover:shadow-red-500/50 
            transition-all duration-300 ease-in-out
            relative overflow-hidden 
            before:absolute before:inset-0 before:bg-white/20 
            before:translate-x-[-100%] hover:before:translate-x-[100%]
            before:transition-transform before:duration-700
            active:scale-95"
        >
          Log out
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
    className="md:hidden"
  >
    <ul className="flex flex-col space-y-4 mt-4">
      {navItems.map((item) => (
        <motion.li
          key={item}
          className="relative cursor-pointer text-lg font-medium px-4 py-2 group"
          onClick={() => handleItemClick(item)}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-400/30 to-blue-500/30 
            blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300
            ${active === item ? 'opacity-75' : ''}`}>
          </div>
          <span className="relative">{item}</span>
          {active === item && (
            <motion.div
              layoutId="mobile-underline"
              className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.li>
      ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                    shadow-lg hover:bg-red-700 hover:shadow-red-500/50 
                    transition-all duration-300 ease-in-out
                    relative overflow-hidden 
                    before:absolute before:inset-0 before:bg-white/20 
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-700
                    active:scale-95"
                >
                  Log out
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
