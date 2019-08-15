import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";

import { FlexForm, InputDiv, Input, Label, ButtonDiv, ErrorDiv } from "../FormComponents";

import { SubmitButton } from "../Buttons";

export default ({submit, setEmail, setPassword, email, password, errors, loading}) => (
<>
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
          </>
  );


const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
`;

const CenteredTitle = styled.h2`
  text-align: center;
`;


const LinkDiv = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;
