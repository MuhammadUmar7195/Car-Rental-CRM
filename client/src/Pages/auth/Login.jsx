import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
          Login
        </h2>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="admin@gmail.com"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
        >
          Login
        </Button>
        <p className="mt-6 text-center text-sm">
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
