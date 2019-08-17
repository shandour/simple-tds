import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import {UserContext} from '../App';
import {NoDecorationLink, Row} from './PageElements';


export default () => {
    const {isLoggedIn, user} = useContext(UserContext);
    if (!isLoggedIn) return null;

    return (
            <HeaderRow>
            <LinkDivWrapper>
            <LinkDiv>
            <AddLink to="/link/add">Add new link
        </AddLink>
            </LinkDiv>
            </LinkDivWrapper>
            <CenteredFlex30Div>
            <AllLinksLink to="/">
            All Links
        </AllLinksLink>
            </CenteredFlex30Div>
            <CenteredFlex30Div><ResponsiveSpan>Logged in as </ResponsiveSpan> {user.email}. <LogoutLink to="/logout">Logout</LogoutLink></CenteredFlex30Div>
            </HeaderRow>
    );
};


const FlexBasis30Div = styled.div`
  flex-basis: 30%;
`;

const CenteredFlex30Div = styled(FlexBasis30Div)`
  flex-basis: 30%;
  text-align: center;
`;

const LinkDivWrapper = styled(FlexBasis30Div)`
  display: flex;
  justify-content: center;
}
`;

const HeaderRow = styled(Row)`
  justify-content: center;
  border: solid 1px gray;
  padding: 20px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 1px 1px;
`;

const LinkDiv = styled.div`
  text-align: center;
  width: 150px;
  border-radius: 10px;
  border: solid blue;
  background: azure;
  padding: 5px;
  &:hover {
    border: solid white;
    box-shadow: 1px 1px;
  }
}
`;

const AddLink = styled(NoDecorationLink)`
  &:hover {
    color: darkblue;
  }
`;

const LogoutLink = styled(NoDecorationLink)`
  color: #600be8;
  font-weight: 800;
`;

const ResponsiveSpan = styled.span`
  @media(max-width: 600px) {
    display: none;
  }
`;

const AllLinksLink = styled(NoDecorationLink)`
  font-weight: 900;
  color: blue
  &:hover {
    color: lightblue;
  }
`;
