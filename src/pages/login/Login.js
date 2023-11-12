import React, { useState } from "react";
import "./Login.css";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import loginImage from "../../assets/Reset.gif";
import { Alert, Button, Form } from "react-bootstrap";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const usernameRegex = /^w+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  const togglePasswordVisibility = () => {
    if (password !== "") {
      setPasswordVisible(!passwordVisible);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleLogin = async () => {
    setErrorMessage("");
    // Validate username and password against rege
    if (!usernameRegex.test(username)) {
      setErrorMessage("Invalid username format");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage("Invalid password format");
      return;
    }
    await fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the login was successful
        if (data.message === "Login successful") {
          // Redirect to another page (replace '/dashboard' with the desired page)
          window.location.href = "/dashboard";
        } else {
          // Handle login failure
          setErrorMessage("Incorrect username or password");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, easing: "easeOutBack" }}
      >
        <Header />
        <div className="loginContainer">
          <h1 className="title">Login</h1>
          <div className="image">
            <img src={loginImage} alt="login" />
          </div>
          <div className="textContainer">
            <h3>Please enter your credentials to login</h3>
            <div className="form">
              <Form.Control
                type="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ borderColor: errorMessage ? "red" : "" }}
              />
              {/* <span style={{ color: "red" }}>{errorMessage}</span> */}
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderColor: errorMessage ? "red" : "" }}
              />
              <span className="eye" onClick={togglePasswordVisibility}>
                {passwordVisible ? (
                  <i className="fa-regular fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </span>
              {/* <ReCAPTCHA
                sitekey="Your client site key"
                onChange={onChange}
                className="captcha"
              /> */}
              <Button type="submit" onClick={handleLogin} variant="primary">
                Login
                <i className="fa-solid fa-arrow-right"></i>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </motion.div>
    </>
  );
};

export default Login;
