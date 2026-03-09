import React from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

const backdrop = (props) =>
    ReactDOM.createPortal(
        <div
            className={["backdrop", props.open ? "open" : "", props.className]
                .filter(Boolean)
                .join(" ")}
            onClick={props.onClick}
            style={props.style}
        />,
        document.getElementById("backdrop-root"),
    );

export default backdrop;
