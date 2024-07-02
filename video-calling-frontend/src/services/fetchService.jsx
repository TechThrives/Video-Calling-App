import { notify } from "./toastService";

const fetchService = async (url, options = {}) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER}${url}`,
      options
    );
    const data = await response.json();

    if (!response.ok) {
      notify(response.status, data.message || "An error occurred");
      return null;
    }

    if (data.message) {
      notify(response.status, data.message);
    }

    return data;
  } catch (error) {
    notify(
      null,
      error.message || "Network error. Please check your connection."
    );

    return null;
  }
};

export default fetchService;
