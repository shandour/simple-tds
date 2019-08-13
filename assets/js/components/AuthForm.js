import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";

import axios from "../axios";
import { UserContext } from "../App";
import { FlexForm, InputDiv, Input, Label, ButtonDiv, ErrorDiv } from "./FormComponents";

import { SubmitButton } from "./Buttons";

export default ({history, location: {pathname}}) => {
  const { login } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [loginForm, setLoginForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    useEffect(() => {
        if (pathname === '/login') {
            setLoginForm(true);
        }
        setLoading(false);
    }, []);

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const data = {
      email,
      password
    };

    try {
      if (loginForm) {
        const resp = await axios.post("login/", data);
        localStorage.setItem("token", resp.data.token);
        const currentUserResp = await axios.get("current-user/", {
          token: resp.data.token
        });
          login(currentUserResp.data);
      } else {
        const resp = await axios.post("register/", data);
        localStorage.setItem("token", resp.data.token);
        const {
          data: { user }
        } = resp;
        login(user);
      }
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
        {loginForm ? (
            <CenteredTitle>Login</CenteredTitle>
        ) : (
            <CenteredTitle>Register</CenteredTitle>
        )}
        <FlexForm onSubmit={submit}>
          <Label htmlFor="email">Email</Label>
          <InputDiv>
            <Input
              name="email"
              type="email"
      onChange={e => setEmail(e.target.value)}
      placeholder="Your email address"
              disabled={loading}
              required
            />
          </InputDiv>
          {errors.email && (
            <ErrorDiv> {errors.email.join(". ")} </ErrorDiv>
          )}
          <Label htmlFor="password">Password</Label>
          <InputDiv>
            <Input
              name="password"
              type="password"
      onChange={e => setPassword(e.target.value)}
      placeholder="Your password"
              disabled={loading}
              required
            />
          </InputDiv>
          {errors.password && (
            <ErrorDiv> {errors.password.join(". ")} </ErrorDiv>
          )}
          <ButtonDiv>
            <SubmitButton type="submit" disabled={loading}>
              Submit
            </SubmitButton>
          </ButtonDiv>
        </FlexForm>
        {errors.non_field_errors && (
          <ErrorDiv> {errors.non_field_errors.join(". ")} </ErrorDiv>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
`;

const CenteredTitle = styled.h2`
  text-align: center;
`;

