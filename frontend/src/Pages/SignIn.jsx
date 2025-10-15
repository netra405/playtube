import React, { useState } from 'react';
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/playtube1.png";
import axios from "axios";
import { serverUrl } from '../App';
import { showCustomAlert } from '../component/CustomAlert';
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // ---------------- Validation functions ----------------
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailRegex.test(email);
  };

  // Step navigation
  const handleNext = () => {
    if (!email) {
      showCustomAlert("Please fill your email");
      return;
    }
    if (!isEmailValid(email)) {
      showCustomAlert("Please enter a valid email (gmail.com, yahoo.com, outlook.com)");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  // ------------------ SignIn Handler ------------------
  const handleSignIn = async () => {
  if (!email || !password) {
    showCustomAlert("Please fill in both email and password");
    return;
  }

  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/signin`,
      { email, password },
      { withCredentials: true }
    );

    // Save user data in Redux
    dispatch(setUserData(result.data));

    // Check for success
    if (result.data.success) {
      showCustomAlert(result.data.message || "Login successful!");
      navigate("/");
    } else {
      showCustomAlert(result.data.message || "Login failed");
    }
  } catch (error) {
    // Handle API or network errors
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong during sign-in";
    showCustomAlert(errorMessage);
    console.error("Sign-in error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className='flex items-center justify-center min-h-screen bg-[#181818] px-4'>
      <div className='bg-[#202124] rounded-2xl p-6 sm:p-10 w-full max-w-md shadow-lg'>
        <div className='flex items-center mb-6'>
          <button onClick={handleBack} className='text-gray-300 mr-3 hover:text-white'>
            <FaArrowLeft size={20} />
          </button>
          <span className='text-white text-xl sm:text-2xl font-medium'>PlayTube</span>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <h1 className='text-2xl sm:text-3xl font-normal mb-5 flex items-center gap-2 text-white'>
              <img className='w-6 sm:w-8 h-6 sm:h-8' src={logo} alt="logo" />
              Sign In
            </h1>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-orange-500 mb-4 text-sm sm:text-base'
              type="email"
              placeholder='Email'
            />
            <div className='flex justify-between items-center mt-6 sm:mt-10'>
              <button onClick={() => navigate("/signup")} className='text-orange-400 text-sm sm:text-base hover:underline'>
                Create Account
              </button>
              <button onClick={handleNext} className='bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-white text-sm sm:text-base'>
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <>
            <h1 className='text-2xl sm:text-3xl font-normal mb-5 flex items-center gap-2 text-white'>
              <img className='w-6 sm:w-8 h-6 sm:h-8' src={logo} alt="logo" />
              Welcome
            </h1>
            <div className='flex items-center bg-[#3c4043] text-white px-3 py-2 sm:py-3 rounded-full w-full mb-4 text-sm sm:text-base'>
              <FaUserCircle className='mr-2' size={20} />
              {email}
            </div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-orange-500 mb-4 text-sm sm:text-base'
              type={showPassword ? "text" : "password"}
              placeholder='Password'
            />
            <div className='flex items-center gap-2 mt-2 sm:mt-3'>
              <input
                type="checkbox"
                id='showpass'
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className='text-gray-300 cursor-pointer text-sm sm:text-base' htmlFor="showpass">Show Password</label>
            </div>
            <div className='flex justify-between items-center mt-6 sm:mt-10'>
              <button onClick={()=>navigate("/forgetpass")} className='text-orange-400 text-sm sm:text-base hover:underline'>Forget password</button>
              <button onClick={handleSignIn} disabled={loading} className='bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-white text-sm sm:text-base flex items-center justify-center gap-2'>
                {loading ? <ClipLoader color='black' size={20}/> :"Sign In"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
