import axios from "axios";

const baseDomain = "http://localhost:9000";
const baseURL = `${baseDomain}/api/v1`;

export default axios.create({
  baseURL: baseURL,
});
