import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const button = (props) =>
    !props.link ? (
        <button
            className={[
                "button",
                `button--${props.design}`,
                `button--${props.mode}`,
                props.className,
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={props.onClick}
            disabled={props.disabled || props.loading}
            type={props.type}
            style={props.style}>
            {props.loading ? (
                <span className="button-loader">
                    <span className="loader-dot"></span>
                    <span className="loader-dot"></span>
                    <span className="loader-dot"></span>
                </span>
            ) : (
                props.children
            )}
        </button>
    ) : (
        <Link
            className={[
                "button",
                `button--${props.design}`,
                `button--${props.mode}`,
                props.className,
            ]
                .filter(Boolean)
                .join(" ")}
            to={props.link}
            style={props.style}>
            {props.children}
        </Link>
    );

export default button;
