import React from "react";
import NavigationItems from "../NavigationItems/NavigationItems";
import "./MobileNavigation.css";

const MobileNavigation = (props) => (
    <nav className={`mobile-nav ${props.open ? "open" : ""}`}>
        <ul className={`mobile-nav__items ${props.mobile ? "mobile" : ""}`}>
            <NavigationItems
                mobile
                onChoose={props.onChooseItem}
                isAuth={props.isAuth}
                onLogout={props.onLogout}
            />
        </ul>
    </nav>
);

export default MobileNavigation;
