import React, { useState, useEffect } from "react";
import "./Register.css";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);
  const [showNameField, setShowNameField] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [userData, setUserData] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const passwordsMatch = (password1, password2) => {
    return password1 === password2;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!isValidEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(!isValidPassword(e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(!passwordsMatch(password, e.target.value));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      console.log("Invalid email:", email);
      return;
    }
    console.log("email:", email);

    try {
      const response = await axios.post("http://localhost:3000/api/otp/send-otp", { email });
      console.log("response from frontend:", response);
      console.log("user data saved!");
      if (response.data.status === "success") {
        setShowOtpModal(true);
      } else if (response.data.status === "fail") {
        setRedirectUrl(response.data.redirectUrl); // redirect to login page
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);

    try {
      const [otpResponse, userResponse] = await Promise.all([
        axios.post("http://localhost:3000/api/otp/verify-otp", { email, otp }),
        axios.post("http://localhost:3000/api/user/check", { email }),
      ]);

      if (otpResponse.data.status === "success" && userResponse.data.status === "success") {
        console.log("OTP verified! and you have a membership");
        console.log("userResponse.data:", userResponse.data);
        setUserData(userResponse.data);
        setOtpError("");
        setAdditionalFieldsVisible(true);
        setShowNameField(false);
        setShowOtpModal(false);
      } else if (otpResponse.data.status === "success" && userResponse.data.status === "fail") {
        console.log("OTP verified! and your a new user");
        setAdditionalFieldsVisible(true);
        setShowNameField(true);
        setShowOtpModal(false);
      } else {
        setOtpError("Otp is not valid, please enter it again");
        console.log("OTP verificatin is failed");
        setOtp("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    // Handle the completion of registration here
    if (!isValidPassword(password)) {
      console.log("Password does not meet complexity requirements");
      return;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      console.log("Passwords do not match");
      return;
    }

    let dataToSend;

    if (!userData || !userData.data) {
      // if userData not exist, create a new user
      dataToSend = {
        email,
        first_name: firstName,
        last_name: lastName,
        created: new Date().toISOString(),
        isPaid: false,
        password,
      };
    } else {
      // if userData exists, use the user data from mockfile/api call
      dataToSend = {
        email: userData.data.email,
        first_name: userData.data.first_name,
        last_name: userData.data.last_name,
        created: userData.data.created,
        event_id: userData.data.event_id,
        isPaid: true,
        password,
      };
    }

    try {
      const response = await axios.post("http://localhost:3000/api/user/save", dataToSend);
      if (response.data.status === "success") {
        console.log("I am saved!!!!!!!");
        setRedirectUrl(response.data.redirectUrl);
      } else if (response.data.status === "fail") {
        console.log("failed to save data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 id="register-modal-title">Register</h2>
        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={emailError && !isFocused ? "error-input" : ""}
          />
        </div>
        {emailError && !isFocused && <p className="error-text">Please enter a valid email address.</p>}
        {!additionalFieldsVisible && (
          <button className="register-button" onClick={handleSubmit}>
            Continue
          </button>
        )}

        {additionalFieldsVisible && (
          <>
            {showNameField && (
              <>
                <div className="input-box">
                  <FaUser className="icon" />
                  <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="input-box">
                  <FaUser className="icon" />
                  <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </>
            )}
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={passwordError ? "error-input" : ""}
              />
            </div>
            {passwordError && (
              <p className="error-text">
                Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase
                letter, one number, and one special character.
              </p>
            )}
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={handleConfirmPasswordChange}
                required
                className={confirmPasswordError ? "error-input" : ""}
              />
            </div>
            {confirmPasswordError && <p className="error-text">Passwords do not match.</p>}
            <button className="register-button" onClick={handleCompleteRegistration}>
              Complete Registration
            </button>
          </>
        )}

        {showOtpModal && (
          <div className="otp-modal">
            <div className="otp-modal-content">
              <span className="close" onClick={() => setShowOtpModal(false)}>
                &times;
              </span>
              <h2>Enter OTP</h2>
              <form onSubmit={handleOtpSubmit}>
                <div className="input-box">
                  <FaLock className="icon" />
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                {otpError && <p className="error-text">{otpError}</p>}
                <button className="register-button" type="submit">
                  Verify
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
