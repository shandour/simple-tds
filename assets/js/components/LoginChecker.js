import React, { useEffect, useContext, useState } from "react";
import axios from "../axios";

import { UserContext } from "../App";

export default ({ children }) => {
  const { login, logout } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get("current-user/", { token });
      login(resp.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) return <>Loading...</>;

  return children;
};
