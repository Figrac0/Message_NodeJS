import React from "react";
import "./Logo.css";

const logo = (props) => (
    <div className="logo-container">
        <h1 className="logo">
            <span className="logo-text">Message</span>
            <span className="logo-highlight">Node.js</span>
        </h1>
        <div className="logo-glow"></div>
        <div className="logo-particles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
);

export default logo;
