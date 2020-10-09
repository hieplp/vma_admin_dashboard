import axios from "axios";

const baseDomain = "https://vehiclemanagementapplication.azurewebsites.net";
const baseURL = `${baseDomain}/api/v1`;

export default axios.create({
  baseURL: baseURL,
});
