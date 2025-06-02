import axios from "axios";

const API_BASE_URL = "/api/mypage";

export const getBasicInfo = async () => {
  const response = await axios.get(`${API_BASE_URL}/info`);
  return response.data;
};

export const updatePhone = async (phone) => {
  const response = await axios.put(`${API_BASE_URL}/phone`, { phone });
  return response.data;
};

export const updateEmail = async (email) => {
  const response = await axios.put(`${API_BASE_URL}/email`, { email });
  return response.data;
};
