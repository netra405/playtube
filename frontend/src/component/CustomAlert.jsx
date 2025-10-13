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
      <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 pt-[100px]">
        <div className="bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80 animate-fadeIn">
          <p className="text-sm">{mess}</p>
          <div className="flex justify-end mt-6">
            <button
              onClick={closeAlert}
              className="text-sm bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white"
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
