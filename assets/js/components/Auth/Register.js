import React, { useContext, useState } from "react";
import {Link} from 'react-router-dom';
import styled from "styled-components";

import AuthForm from './AuthForm';
import {CenteredTitle, LinkDiv, Wrapper} from '../PageElements';
import axios from "../../axios";
import { UserContext } from "../../App";


export default ({history, location: {pathname}}) => {
  const { login } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const data = {
      email,
      password
    };

    try {
        const resp = await axios.post("register/", data);
        localStorage.setItem("token", resp.data.token);
        const {
          data: { user }
        } = resp;
        login(user);
        history.push('/');
    } catch ({ response }) {
      if (response) {
        setErrors(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div>
              <CenteredTitle>Register</CenteredTitle>
                  <LinkDiv>
                  <Link to="/login">Already have an account?</Link>
                  </LinkDiv>
          <AuthForm
      submit={submit}
      loading={loading}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errors={errors}
          />
      </div>
    </Wrapper>
  );
};

