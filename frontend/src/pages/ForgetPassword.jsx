import React, { useState } from "react";

function ForgetPassword() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            {step == 1 && (
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Forgot Password
                    </h2>

                    <form className='space-y-4'>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[black]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button className="w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer">
                            Send OTP
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ForgetPassword;