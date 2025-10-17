import React, { useState } from 'react'
import logo from "../assets/playtube1.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from "../App"
import { showCustomAlert } from '../component/CustomAlert'
import ClipLoader from 'react-spinners/ClipLoader'

const ForgetPassword = () => {

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/sendotp", { email }, { withCredentials: true })
            console.log(result.data)
            setStep(2)
            setLoading(false)
            showCustomAlert(result.data.message)
        } catch (error) {
            console.log(error)
            setLoading(false)
            showCustomAlert(error.response.data.message)
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true })
            console.log(result.data)
            setStep(3)
            setLoading(false)
            showCustomAlert(result.data.message)
        } catch (error) {
            console.log(error)
            setLoading(false)
            showCustomAlert(error.response.data.message)
        }
    }

    const handleResetPassword = async () => {
        setLoading(true)
        try {
            if (newPassword !== confirmPassword) {
                setLoading(false)
                showCustomAlert("Password is not match")
            }
            const result = await axios.post(serverUrl + "/api/auth/resetPassword", { email, password: newPassword }, { withCredentials: true })
            console.log(result.data)
            navigate("/signin")
            setLoading(false)
            showCustomAlert(result.data.message)
        } catch (error) {
            console.log(error)
            setLoading(false)
            showCustomAlert(error.response.data.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#202124] text-white">
            {/* Header */}
            <header className="flex items-center gap-2 p-4 border-b border-gray-700 justify-center sm:justify-start">
                <img className="w-8 h-8 object-cover" src={logo} alt="logo" />
                <span className="text-white font-bold text-xl sm:text-2xl tracking-tight font-roboto">
                    PlayTube
                </span>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 md:px-10">
                {/* Step 1 */}
                {step === 1 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg transition-transform duration-300 hover:scale-[1.01]">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                            Forget your password
                        </h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
                                    Enter your email address
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="text"
                                    id="email"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleSendOtp}
                                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader color="black" size={20} /> : "Send OTP"}
                            </button>
                        </form>

                        <div
                            onClick={() => navigate("/signin")}
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer hover:underline"
                        >
                            Back to Sign In
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg transition-transform duration-300 hover:scale-[1.01]">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                            Enter OTP
                        </h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="otp" className="block text-sm mb-1 text-gray-300">
                                    Please enter the 4-digit code sent to your email.
                                </label>
                                <input
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                    type="text"
                                    id="otp"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader color="black" size={20} /> : "Verify OTP"}
                            </button>
                        </form>

                        <div
                            onClick={() => navigate("/signin")}
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer hover:underline"
                        >
                            Back to Sign In
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg transition-transform duration-300 hover:scale-[1.01]">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                            Reset your password
                        </h2>
                        <p className="text-sm text-gray-400 mb-6 text-center sm:text-left">
                            Enter a new password below to regain access to your account.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="newpass" className="block text-sm mb-1 text-gray-300">
                                    New Password
                                </label>
                                <input
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    type="password"
                                    id="newpass"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />

                                <label
                                    htmlFor="conpass"
                                    className="block text-sm mb-1 text-gray-300 mt-6"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    type="password"
                                    id="conpass"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleResetPassword}
                                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 px-4 rounded-md font-medium"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader color="black" size={20} /> : "Reset Password"}
                            </button>
                        </form>

                        <div
                            onClick={() => navigate("/signin")}
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer hover:underline"
                        >
                            Back to Sign In
                        </div>
                    </div>
                )}
            </main>
        </div>

    )
}

export default ForgetPassword
