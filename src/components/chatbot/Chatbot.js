import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextWithCode from "./TextWithCode";
import Microphone from "./Microphone";
import "./Chatbot.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Chatbot = ({ isVisible, toggleVisibility }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const isRecognitionActive = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSubmit(transcript); // Automatically submit the recognized text
    };

    recognition.onend = () => {
      if (isRecognitionActive.current) {
        recognition.start();
      }
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startVoiceRecording = () => {
    if (!isRecognitionActive.current) {
      isRecognitionActive.current = true;
      recognition.start();
    }
  };

  const chatWithGPT3 = async (userInput) => {
    const apiEndpoint = "http://127.0.0.1:5000/generate_text";

    const data = {
      user_message: userInput,
      chatbot: Object.values(messages),
      history: history,
    };

    try {
      const response = await axios.post(apiEndpoint, data);
      setHistory(response.data[1]);
      setError(false);

      return response.data[1][response.data[1].length - 1];
    } catch (err) {
      console.error("Error communicating with the API:", err.message);
      setError(true);

      return err.message;
    }
  };

  const handleSubmit = async (userInput) => {
    if (!userInput.trim() || error || messageCount >= 5) return;

    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const aiMessage = { text: "...", user: false, isError: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    const response = await chatWithGPT3(userInput);
    const newAiMessage = { text: response, user: false, isError: error };
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    setInput("");
    setMessageCount((prevCount) => prevCount + 1);
  };

  return (
    <div className={`chatbot-container ${isVisible ? "" : "hidden"}`}>
      <div className="chatbot-messages">
        <p className="ChatTitle">
          Hello, let's answer some of your questions...
        </p>
        <button onClick={toggleVisibility}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.user ? "user-message" : "ai-message"
            } ${error && index % 2 !== 0 ? "error-message" : ""}`}
          >
            <TextWithCode text={message.text} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={error || messageCount >= 2}
        />
        <button
          type="button"
          className="microphone"
          onClick={startVoiceRecording}
          disabled={error || messageCount >= 2}
        >
          {isRecognitionActive.current ? (
            <i className="fa-solid fa-microphone fa-fade"></i>
          ) : (
            <i className="fa-solid fa-microphone"></i>
          )}
        </button>
        <button type="submit" disabled={error || messageCount >= 2}>
          Send
        </button>
      </form>
      {messageCount >= 2 && (
        <p className="login-message">
          To continue the conversation, please{" "}
          <a style={{ color: "#526d82" }} href="/login">
            Login.
          </a>
        </p>
      )}
    </div>
  );
};

export default Chatbot;
