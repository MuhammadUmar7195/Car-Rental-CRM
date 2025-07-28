const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600 space-y-2 sm:space-y-0 sm:space-x-4">
          <p className="text-center">
            © {currentYear} Car Rental App. All rights reserved.
          </p>
          {appVersion && (
            <div className="flex items-center space-x-2 animate-fadeIn">
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="text-[11px] font-mono bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-[2px] rounded-full shadow-sm transition-all">
                v{appVersion}
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
