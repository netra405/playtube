import React, { useEffect, useState } from 'react';

let alertHandle;

export const showCustomAlert = (message) => {
  if (alertHandle) {
    alertHandle(message);
  }
};

const CustomAlert = () => {
  const [mess, setMess] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    alertHandle = (message) => {
      setMess(message);
      setVisible(true);
    };
  }, []);

  const closeAlert = () => {
    setVisible(false);
    setMess('');
  };

  return (
    visible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 sm:px-0">
        <div className="bg-[#202124] text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all duration-300 scale-100 animate-fadeIn">
          <p className="text-sm sm:text-base text-center leading-relaxed">
            {mess}
          </p>

          <div className="flex justify-center sm:justify-end mt-6">
            <button
              onClick={closeAlert}
              className="text-sm sm:text-base bg-orange-500 hover:bg-orange-600 active:bg-orange-700 px-6 py-2 rounded-full font-medium transition-transform duration-200 hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      </div>

    )
  );
};

export default CustomAlert;
