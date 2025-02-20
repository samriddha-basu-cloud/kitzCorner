import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white w-full mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-wide">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">SB</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Your creative corner for innovative solutions.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold after:content-[''] after:block after:w-12 after:h-1 after:bg-blue-500 after:mt-2 mx-auto md:mx-0">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:info@sb.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 justify-center md:justify-start group">
                <div className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Mail size={16} />
                </div>
                <span>info@sb.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 justify-center md:justify-start group">
                <div className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Phone size={16} />
                </div>
                <span>+123 456 7890</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400 justify-center md:justify-start group">
                <div className="p-2 bg-gray-800 rounded-full">
                  <MapPin size={16} />
                </div>
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold after:content-[''] after:block after:w-12 after:h-1 after:bg-blue-500 after:mt-2 mx-auto md:mx-0">Connect</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="font-medium">SB</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;