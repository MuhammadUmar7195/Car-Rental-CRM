import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/Slices/auth.slice";
import { toast } from "sonner";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful!");
        navigate("/login");
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
          Register
        </h2>
        <div className="flex flex-col gap-1">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Your Username"
            value={data.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@gmail.com"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center text-sm">
          If you have an account?
          <Link to={`/login`} className="text-gray-500 ml-1 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
