import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser,  } from "@/store/Slices/auth.slice";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (res.meta.requestStatus === "rejected") {
        toast.error(res.payload || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
          Login
        </h2>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@gmail.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="flex flex-col gap-2 mt-2">
          <Link to="/forgot-password" className="text-sm text-purple-600 hover:underline text-center">
            Forgot password?
          </Link>
        </div>
        <p className="mt-2 text-center text-sm">
          Don't have an account?
          <Link to={`/register`} className="text-gray-500 ml-1 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
