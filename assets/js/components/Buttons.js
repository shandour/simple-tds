import React from "react";
import styled from "styled-components";

export const ButtonBase = ({ children, ...props }) => (
  <button type="button" {...props}>
    {children}
  </button>
);

const Button = styled(ButtonBase)`
  text-decoration: none;
  text-align: center;
  letter-spacing: 0.5px;
  cursor: pointer;
  color: #fff;
  padding: 5px 20px;
  height: 45px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 20px;
  transition: '0.2s'
   
    &:hover {
    box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.3);
  }

  &:active {
    box-shadow: none;
  }
`;

export const DangerBtn = styled(Button)`
  background-color: #d42626 !important;
  height: 35px;
  font-size: 10px;

  &:hover {
    background-color: #fff !important;
    color: #d42626;
  }
`;

export const AddButton = styled(Button)`
  background-color: green;
  &:hover {
    background-color: white;
    color: green;
  }
`;

export const EditButton = styled(Button)`
  background-color: lightblue;
  &:hover {
    background-color: white;
    color: lightblue;
  }
`;

export const CancelButton = styled(Button)`
  background-color: #d89361;
  font-size: 10px;
  padding: 15px;
  &:hover {
    background-color: white;
    color: #d89361;
  }
`;

export const SubmitButton = styled(Button)`
  width: 300px;
  background: blue;
  &:hover {
    background-color: white;
    color: blue;
  }
`;

export const LogoutButton = styled(Button)`
  background: pink;
  &:hover {
    background-color: white;
    color: pink;
  }
`;
