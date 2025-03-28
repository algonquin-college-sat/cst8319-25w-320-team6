import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Navbar/Nav";
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import PastEventPage from "./pages/PastEventPage";
import Membership from "./pages/Membership";
import Volunteer from "./pages/Volunteer";
import News from "./pages/PostPage";
import ContactUs from "./pages/ContactUs";
import Gallery from "./pages/Gallery";
import LoginForm from "./components/Login/LoginForm";
import Register from "./components/Register/Register";
import MemberManagePage from "./pages/MemberManagePage";
import EventManagePage from "./pages/EventManagePage";
import VolunteerManagePage from "./pages/VolunteerManagePage";
import ResetPasswordPage from "./components/Login/ResetPasswordPage";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./UserContext";
import AddPostForm from "./components/Post/AddPostForm";
import Policy from "./components/Volunteer/Policy";

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/past-events" element={<PastEventPage />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/member-manage" element={<MemberManagePage />} />
            <Route path="/event-manage" element={<EventManagePage />} />
            <Route path="/volunteer-manage" element={<VolunteerManagePage />} />
            <Route path="/add-news" element={<AddPostForm />} />
            <Route path="/policy" element={<Policy />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
