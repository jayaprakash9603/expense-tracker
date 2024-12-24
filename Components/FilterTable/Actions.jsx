import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

const Actions = ({ id, onDelete }) => (
  <div>
    <Link to={`/read/${id}`}>
      <FontAwesomeIcon icon={faEye} className="text-primary" />
    </Link>
    <Link to={`/edit/${id}`}>
      <FontAwesomeIcon icon={faEdit} className="text-success mx-2" />
    </Link>
    <FontAwesomeIcon
      icon={faTrash}
      className="text-danger"
      onClick={() => onDelete(id)}
      style={{ cursor: "pointer" }}
    />
  </div>
);

export default Actions;
