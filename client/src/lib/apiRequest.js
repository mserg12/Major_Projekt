import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:3301/api",
  withCredentials: true, 
});

export default apiRequest;
