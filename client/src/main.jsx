import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import axios from "axios";
import { logout } from "./store/Slices/auth.slice";

// Global axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and dispatch logout action
      localStorage.removeItem("userInfo");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);
