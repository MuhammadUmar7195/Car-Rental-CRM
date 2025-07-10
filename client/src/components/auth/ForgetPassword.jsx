import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyPassword,
  resetPassword,
} from "@/store/Slices/auth.slice";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle OTP input
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Move to next input
    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  // Step 1: Send email for OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    const res = await dispatch(forgotPassword(email));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("OTP sent to your email");
      setStep(2);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return toast.error("Enter 6 digit OTP");
    const res = await dispatch(verifyPassword({ email, otp: otpValue }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("OTP verified. Set new password.");
      setStep(3);
    }
  };

  // Step 3: Reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    const res = await dispatch(
      resetPassword({ email, newPassword, confirmPassword })
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password reset successful!");
      setStep(1);
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-5"
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
            ? handleOtpSubmit
            : handleResetSubmit
        }
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
          Forgot Password
        </h2>
        {step === 1 && (
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                className="text-sm text-purple-600 hover:underline text-center"
              >
                Go back Login?
              </Link>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Label>Enter 6-digit OTP</Label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 text-center text-xl border border-purple-300 focus:ring-purple-400"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  required
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <Button
              type="submit"
              className="bg-purple-700 text-white hover:bg-purple-800 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgetPassword;
