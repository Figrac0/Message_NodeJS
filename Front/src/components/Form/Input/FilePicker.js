import React, { useRef, useState } from "react";
import "./Input.css";

const filePicker = (props) => {
    const [fileName, setFileName] = useState("");
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            props.onChange(props.id, e.target.value, e.target.files);
        } else {
            setFileName("");
            setPreview(null);
        }
    };

    const handleClear = () => {
        setFileName("");
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        props.onChange(props.id, "", null);
    };

    return (
        <div className="file-picker">
            <label className="file-picker__label">{props.label}</label>

            <div className="file-picker__wrapper">
                <input
                    ref={fileInputRef}
                    className={[
                        "file-picker__input",
                        !props.valid ? "invalid" : "valid",
                        props.touched ? "touched" : "untouched",
                    ].join(" ")}
                    type="file"
                    id={props.id}
                    onChange={handleFileChange}
                    onBlur={props.onBlur}
                    accept="image/*"
                />

                <div className="file-picker__content">
                    {preview ? (
                        <div className="file-picker__preview">
                            <img src={preview} alt="Preview" />
                            <button
                                type="button"
                                className="file-picker__remove"
                                onClick={handleClear}
                                aria-label="Remove image">
                                ×
                            </button>
                        </div>
                    ) : (
                        <div className="file-picker__placeholder">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="2.18"
                                    ry="2.18"></rect>
                                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path>
                            </svg>
                            <span>Click to upload image</span>
                        </div>
                    )}

                    <div className="file-picker__info">
                        {fileName && (
                            <span className="file-picker__name">
                                {fileName}
                            </span>
                        )}
                        <label
                            htmlFor={props.id}
                            className="file-picker__button">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            Choose File
                        </label>
                    </div>
                </div>
            </div>

            {!props.valid && props.touched && (
                <div className="file-picker__error">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Please select an image
                </div>
            )}
        </div>
    );
};

export default filePicker;
