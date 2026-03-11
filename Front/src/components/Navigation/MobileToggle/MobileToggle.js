import React, { useState } from "react";
import "./MobileToggle.css";

const mobileToggle = (props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className="mobile-toggle"
            onClick={props.onOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <span
                className={`mobile-toggle__bar ${isHovered ? "hover" : ""}`}
            />
            <span
                className={`mobile-toggle__bar ${isHovered ? "hover" : ""}`}
            />
            <span
                className={`mobile-toggle__bar ${isHovered ? "hover" : ""}`}
            />
            <div className="mobile-toggle__glow"></div>
            <div className="mobile-toggle__particles">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    );
};

export default mobileToggle;
