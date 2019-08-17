import React from "react";
import styled, { css } from "styled-components";

export const FlexForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
`;

export const sharedStyles = css`
  width: 90%;
  border-radius: 5px;
  width: 90%;
  border-radius: 5px;
  min-height: 25px;
  padding: 7px;
`;

export const Input = styled.input`
  ${sharedStyles}
`;

export const TextArea = styled.textarea`
  ${sharedStyles}
`;

export const Label = styled.label`
  text-align: center;
  font-weight: bold;
`;

export const ButtonDiv = styled.div`
  text-align: center;
`;

export const ErrorDiv = styled.span`
  color: red;
  text-align: center;
`;
