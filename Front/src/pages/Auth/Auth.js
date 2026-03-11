import React from "react";
import "./Auth.css";

const auth = (props) => (
    <section className="auth-form">
        <div className="auth-form__glow"></div>
        <div className="auth-form__content">{props.children}</div>
        <div className="auth-form__particles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </section>
);

export default auth;
