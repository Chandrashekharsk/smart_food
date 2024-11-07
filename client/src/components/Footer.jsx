// Footer.jsx
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 text-gray-100 py-10 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-4xl font-extrabold text-white mb-2">S͙M͙A͙R͙T͙ F͙O͙O͙D͙</h2>
          <p className="text-sm pt-3 max-w-xs">
            Discover, create, and share delicious recipes with the community. Bringing food lovers together, one recipe at a time.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-3 text-violet-200">Quick Links</h3>
          <ul className="space-y-1">
            <li><NavLink to="/" className="hover:text-white transition duration-300">Home</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-white transition duration-300">Contact Us</NavLink></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-violet-200">Follow Us</h3>
          <div className="flex space-x-6">
            <a href="https://instagram.com/chandrashekharsk__" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition duration-300">
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com/cs9981625252" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-400 transition duration-300">
              <FaTwitter size={24} />
            </a>
            <a href="https://github.com/Chandrashekharsk" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-400 transition duration-300">
              <FaGithub size={24} />
            </a>
            <a href="https://www.linkedin.com/in/chandrashekhar-singh-kushwaha/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-400 transition duration-300">
              <FaLinkedinIn size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-violet-400 transition duration-300">
              <FaFacebookF size={24} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-400 transition duration-300">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="border-t border-gray-500 mt-8 pt-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SMART FOOD. All rights reserved.</p>
      </div>
    </footer>
  );
}
