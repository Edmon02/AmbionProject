import React, { useState, useEffect } from "react";

const TextAsHuman = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prevText) => prevText + text[index]);

      if (index === text.length - 1) {
        clearInterval(typingInterval);
      }
      index++;
    }, 50);

    return () => clearInterval(typingInterval);
  }, [text]);

  return displayedText;
};

export default TextAsHuman;
