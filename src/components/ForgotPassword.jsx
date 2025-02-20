// components/ForgotPassword.jsx
import { useState } from "react";
import { auth } from "../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent.");
    } catch (err) {
      console.error(err);
      setMessage("Error sending reset email.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Reset Password</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Send Reset Link</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
