import axios from "axios";

export const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL, // Use baseURL (case-sensitive)
  headers: {
    "Content-Type": "application/json", // You can keep this if the API expects JSON content
  },
});
