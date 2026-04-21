import { FaCheckCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-purple-800 shadow-md py-4 px-2">
      <div className="max-w-4xl mx-auto flex justify-center items-center">
        <span className="text-2xl md:text-3xl font-bold text-white text-center w-full">
          <span className="inline-flex mr-3 rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 shadow-lg p-2">
            <FaCheckCircle size={18} className="text-white drop-shadow" />
          </span>
          Astro Motors CRM
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
