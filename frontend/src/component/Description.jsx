import React, { useState, useRef, useEffect } from 'react';

const Description = ({ text = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef();

  useEffect(() => {
    if (textRef.current) {
      // Compare scrollHeight with clientHeight to see if text is cut off
      if (textRef.current.scrollHeight > textRef.current.clientHeight) {
        setShowButton(true);
      }
    }
  }, [text]);

  return (
    <div className="relative overflow-hidden px-2 py-1">
      <p
        ref={textRef}
        className={`text-sm text-gray-300 whitespace-pre-line break-words transition-all duration-300`}
        style={{ maxHeight: expanded ? "1000px" : "3rem", overflow: "hidden" }}
      >
        {text}
      </p>

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-400 mt-1 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default Description;
