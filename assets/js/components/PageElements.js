import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';


export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center
  margin: 30px;
`;

export const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  border: solid gray 1px;
  border-radius: 10px;
  box-shadow: 5px 5px;
  width: 100%;
  min-height: 300px;
`;

export const Row = styled.div`
  display: flex;
  padding: 10px 30px;
`;

export const CenteredTitle = styled.h2`
  text-align: center;
`;

export const ErrorTitle = styled(CenteredTitle)`
  color: red;
`;

export const Wrapper = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
`;

export const LinkDiv = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const ColDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RoundedColDiv = styled(ColDiv)`
  border-radius: 20px;
  border: 1px solid black;
`;

export const BadgeFlexDiv = styled.div`
  height: fit-content;
  width: fit-content;
  background-color: #bbb;
   border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  min-height: 25px;
`;

export const PaddedDiv = styled.div`
  padding: 5px;
`;

export const Badge = ({text}) => <BadgeFlexDiv><PaddedDiv>{text}</PaddedDiv></BadgeFlexDiv>

export const NoDecorationLink = styled(Link)`
  text-decoration: none;
`;
