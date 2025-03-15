"use client";
import { useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import Image from "next/image";
import login from "@/public/login.jpg";
import { Toaster, toast } from "react-hot-toast";

export default function AuthPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
    });
    const [isSignup, setIsSignup] = useState(false);

    const handleForm = (e:any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value.trim() });
    };

    const sign = async (e:any) => {
        e.preventDefault();

        if (isSignup) {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                toast.success("Sign Up Successful!");
                setForm({ name: "", email: "", phone: "", role: "", password: "" });
            } else {
                toast.error("Sign Up Failed!");
            }
        } else {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (response.ok) {
                toast.success("Login Successful!");
                setForm({ name: "", email: "", phone: "", role: "", password: "" });
                window.location.href = "/";
            } else {
                toast.error("Login Failed!");
            }
        }
    };

    useEffect(() => {
        setForm({ name: "", email: "", phone: "", role: "", password: "" });
    }, [isSignup]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Toaster position="top-right" reverseOrder={true} />
            <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
                {/* Left Side - Image */}
                <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-200 w-full h-2/4">
                    <Image src={login} alt="loading" className="w-full h-full" />
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        {isSignup ? "Sign Up" : "Login"}
                    </h2>

                    <form className="flex flex-col space-y-4" onSubmit={sign}>
                        {isSignup && (
                            <>
                                <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                                    <FaUser className="text-purple-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="outline-none w-full"
                                        name="name"
                                        onChange={handleForm}
                                        value={form.name}
                                    />
                                </div>
                                <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                                    <FaPhone className="text-purple-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Phone No"
                                        className="outline-none w-full"
                                        name="phone"
                                        onChange={handleForm}
                                        value={form.phone}
                                    />
                                </div>
                                <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                                    <select
                                        name="role"
                                        className="outline-none w-full bg-white p-2 rounded-lg"
                                        onChange={handleForm}
                                        value={form.role}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="institute">Institute</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                            <FaEnvelope className="text-purple-400 mr-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="outline-none w-full"
                                name="email"
                                onChange={handleForm}
                                value={form.email}
                            />
                        </div>
                        <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                            <FaLock className="text-purple-400 mr-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="outline-none w-full"
                                name="password"
                                onChange={handleForm}
                                value={form.password}
                            />
                        </div>
                        <button className="w-full bg-purple-400 text-white py-2 rounded-lg hover:bg-purple-500">
                            {isSignup ? "Sign Up" : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-4">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                        <span
                            className="text-purple-400 cursor-pointer"
                            onClick={() => setIsSignup(!isSignup)}
                        >
                            {isSignup ? " Login" : " Sign Up"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
