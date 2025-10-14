import React, { useState } from 'react';
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/playtube1.png";
import axios from "axios";
import { serverUrl } from '../App';
import ClipLoader from "react-spinners/ClipLoader";
import { showCustomAlert } from '../component/CustomAlert';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  // ---------------- Validation functions ----------------
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Step navigation
  const handleNext = () => {
    if (step === 1) {
      if (!userName || !email) {
        showCustomAlert("Please fill all fields");
        return;
      }
      if (!isEmailValid(email)) {
        showCustomAlert("Please enter a valid email (gmail.com, yahoo.com, outlook.com)");
        return;
      }
    }

    if (step === 2) {
      if (!password || !confirmPassword) {
        showCustomAlert("Please fill all fields");
        return;
      }
      if (password !== confirmPassword) {
        showCustomAlert("Passwords do not match");
        return;
      }
      if (!isPasswordValid(password)) {
        showCustomAlert("Password must be at least 8 characters, include uppercase, lowercase, number, and special character (@#$%^&*!)");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // ------------------ SignUp Handler ------------------
  const handleSignUp = async () => {
    if (!backendImage) {
      showCustomAlert("Please choose a profile image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);

    try {
      const res = await axios.post(`${serverUrl}/api/auth/signup`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(res.data))

      if (res.data.success) {
        showCustomAlert(res.data.message || "Account Created");
        navigate("/");
      } else {
        showCustomAlert(res.data.message || "SignUp error");
      }
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "SignUp error");
      console.error(error);
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
          <span className='text-white text-xl sm:text-2xl font-medium'>Create Account</span>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <h1 className='text-2xl sm:text-3xl font-normal mb-5 flex items-center gap-2 text-white'>
              <img className='w-6 sm:w-8 h-6 sm:h-8' src={logo} alt="logo" />
              Basic Info
            </h1>
            <input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-orange-500 mb-4 text-sm sm:text-base'
              type="text"
              placeholder='Username'
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-orange-500 mb-4 text-sm sm:text-base'
              type="email"
              placeholder='Email'
            />
            <div className='flex justify-end mt-6 sm:mt-10'>
              <button
                onClick={handleNext}
                className='bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-white text-sm sm:text-base'
              >
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
              Security
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
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 sm:py-3 text-white focus:outline-none focus:border-orange-500 mb-4 text-sm sm:text-base'
              type={showPassword ? "text" : "password"}
              placeholder='Confirm Password'
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
            <div className='flex justify-end mt-6 sm:mt-10'>
              <button
                onClick={handleNext}
                className='bg-orange-500 hover:bg-orange-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-white text-sm sm:text-base'
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3: Profile Image */}
        {step === 3 && (
          <>
            <h1 className='text-2xl sm:text-3xl font-normal mb-5 flex items-center gap-2 text-white'>
              <img className='w-6 sm:w-8 h-6 sm:h-8' src={logo} alt="logo" />
              Choose Avatar
            </h1>
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4'>
              <div className='w-24 sm:w-28 h-24 sm:h-28 border-4 border-gray-500 overflow-hidden shadow-lg rounded-full'>
                {frontendImage ? (
                  <img src={frontendImage} className='w-full h-full object-cover' alt="avatar" />
                ) : (
                  <FaUserCircle className='text-gray-500 w-full h-full p-2' />
                )}
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <label className='text-gray-300 font-medium text-sm sm:text-base'>Choose Profile Picture</label>
                <input
                  onChange={handleImage}
                  accept='image/*'
                  className='block w-full text-sm sm:text-base text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer'
                  type="file"
                />
              </div>
            </div>
            <div className='flex justify-end mt-6 sm:mt-10'>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className='bg-green-500 hover:bg-green-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-white flex items-center justify-center gap-2 text-sm sm:text-base'
              >
                {loading ? <ClipLoader color="#000" size={20} /> : "Create Account"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
