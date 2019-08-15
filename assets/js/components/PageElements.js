import React from 'react';
import styled, {media} from 'styled-components';


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
