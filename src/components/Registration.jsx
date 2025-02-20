// components/Registration.jsx
import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Registration = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!validatePassword(form.password)) return setError("Password must be 8+ characters, include uppercase, lowercase, and a number.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });

      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "customers", userCredential.user.uid), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        joinedAt: serverTimestamp(),
        uid: userCredential.user.uid
      });

      setError("Check your email to verify your account.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Full Name" onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <Input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Registration;
