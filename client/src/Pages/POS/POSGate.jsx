import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { MdPersonPin } from "react-icons/md";

const POSGate = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg space-y-6 border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 drop-shadow-sm mb-8">
          Select Service Type
        </h1>
        <div className="flex flex-col gap-5">
          <div
            onClick={() => navigate("/dashboard/pos/car-service")}
            className="flex items-center justify-between gap-3 p-5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FaCar size={26} className="text-white" />
              <span className="text-base md:text-lg font-medium">
                Service Your Car
              </span>
            </div>
            <span className="text-xs uppercase tracking-wide">Continue</span>
          </div>

          <div
            onClick={() => navigate("/dashboard/pos/walk-in")}
            className="flex items-center justify-between gap-3 p-5 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MdPersonPin size={26} className="text-blue-700" />
              <span className="text-base md:text-lg font-medium">
                Walk-in Customer
              </span>
            </div>
            <span className="text-xs uppercase tracking-wide">Continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSGate;