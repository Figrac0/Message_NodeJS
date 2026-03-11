import React, { useRef, useEffect } from "react";
import NavigationItems from "../NavigationItems/NavigationItems";
import "./MobileNavigation.css";

const MobileNavigation = (props) => {
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                navRef.current &&
                !navRef.current.contains(event.target) &&
                props.open
            ) {
                props.onChooseItem();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.open, props.onChooseItem]);

    return (
        <>
            <div
                className={`mobile-nav-overlay ${props.open ? "visible" : ""}`}
                onClick={props.onChooseItem}
            />
            <nav
                ref={navRef}
                className={`mobile-nav ${props.open ? "open" : ""}`}>
                <button
                    className="mobile-nav__close"
                    onClick={props.onChooseItem}>
                    ×
                </button>
                <div className="mobile-nav__header">
                    <h2 className="mobile-nav__title">Menu</h2>
                    <div className="mobile-nav__decor"></div>
                </div>
                <ul
                    className={`mobile-nav__items ${
                        props.mobile ? "mobile" : ""
                    }`}>
                    <NavigationItems
                        mobile
                        onChoose={props.onChooseItem}
                        isAuth={props.isAuth}
                        onLogout={props.onLogout}
                    />
                </ul>
                <div className="mobile-nav__footer">
                    <div className="mobile-nav__particles">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default MobileNavigation;
