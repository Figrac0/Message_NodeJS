import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import Button from "../Button/Button";
import "./Modal.css";

const Modal = (props) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = "hidden";

        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, []);

    return ReactDOM.createPortal(
        <div className="modal">
            <header className="modal__header">
                <h1>{props.title}</h1>
            </header>
            <div className="modal__content">{props.children}</div>
            <div className="modal__actions">
                <Button
                    design="danger"
                    mode="flat"
                    onClick={props.onCancelModal}>
                    Cancel
                </Button>
                <Button
                    mode="raised"
                    onClick={props.onAcceptModal}
                    disabled={!props.acceptEnabled}
                    loading={props.isLoading}>
                    Accept
                </Button>
            </div>
        </div>,
        document.getElementById("modal-root"),
    );
};

export default Modal;
