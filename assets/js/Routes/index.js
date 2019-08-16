import React from 'react';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';

import Logout from '../components/Logout';
import Overview from '../components/Overview';
import Statistics from '../components/Statistics';
import EditLink from '../components/EditLink';
import AddLink from '../components/AddLink';
import IPOverview from '../components/IPOverview';


import {
    UnauthorizedOnlyRoute,
    AuthorizedOnlyRoute,
} from './SpecialRoutes';

export default () => (
        <Router basename='/management'>
        <Switch>
        <AuthorizedOnlyRoute path="/" exact component={Overview} />
        <AuthorizedOnlyRoute path="/link/add" exact component={AddLink} />
       <AuthorizedOnlyRoute path="/link/:link" exact component={Statistics} />
        <AuthorizedOnlyRoute path="/link/:link/edit" exact component={EditLink} />
      <AuthorizedOnlyRoute path="/ip/:ip" exact component={IPOverview} />
        <AuthorizedOnlyRoute path="/logout" exact component={Logout} />

        <UnauthorizedOnlyRoute path="/register" exact component={Register} />
        <UnauthorizedOnlyRoute path="/login" exact component={Login} />
        </Switch>
   </Router>
);

