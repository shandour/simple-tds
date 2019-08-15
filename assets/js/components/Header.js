import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import { Container, Row } from 'styled-bootstrap-grid';
import styled from 'styled-components';

import {UserContext} from '../App';


export default () => {
    const {isLoggedIn, user} = useContext(UserContext);
    if (!isLoggedIn) return null;

    return (
            <StretchedRow>
            <LinkDiv>
            <NoDecorationLink to="/links/add">Add new link
        </NoDecorationLink>
            </LinkDiv>
            <div>Logged in as {user.email}. <Link to="/logout">Logout</Link></div>
            </StretchedRow>
    );
};

const StretchedRow = styled(Row)`
  justify-content: space-around;
  border: solid 1px gray;
  padding: 20px;
  align-items: center;
  margin-bottom: 20px;
`;

const LinkDiv = styled.div`
  border-radius: 10px;
  border: solid blue;
  background: azure;
  padding: 5px;
}
`;

const NoDecorationLink = styled(Link)`
  text-decoration: none;
`
