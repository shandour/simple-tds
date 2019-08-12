import Axios from "axios";

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const csrftoken = getCookie('csrftoken');

const axios = Axios.create({
  baseURL: '/api/',
  headers: {
    accept: "application/json"
  },
      headers: {
    'X-CSRFToken': csrftoken,
  }
});

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default axios;
