import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

const Actions = ({ id, onDelete }) => (
  <div>
    <Link to={`/read/${id}`}>
      <IconButton color="primary">
        <FontAwesomeIcon icon={faEye} />
      </IconButton>
    </Link>
    <Link to={`/edit/${id}`}>
      <IconButton color="success">
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
    </Link>
    <IconButton color="error" onClick={() => onDelete(id)}>
      <FontAwesomeIcon icon={faTrash} />
    </IconButton>
  </div>
);

export default Actions;
