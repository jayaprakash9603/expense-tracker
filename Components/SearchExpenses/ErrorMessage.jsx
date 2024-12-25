import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const ErrorMessage = ({ error }) => (
  <div className="error-message">
    {error && (
      <div className="error-message-div">
        <div className="error-icon-div">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="me-2 error-icon"
          />
        </div>
        <div className="error-message">
          <p className="text-danger mt-3 fw-bold">{error}</p>
        </div>
      </div>
    )}
  </div>
);

export default ErrorMessage;
