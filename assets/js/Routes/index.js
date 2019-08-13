import React from 'react';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Logout from '../components/Logout';
import Overview from '../components/Overview';
import Statistics from '../components/Statistics';
import EditLink from '../components/EditLink';
import IPOverview from '../components/IPOverview';


import {
    UnauthorizedOnlyRoute,
    AuthorizedOnlyRoute,
} from './SpecialRoutes';

export default () => (
  <Router basename='/management'>
        <Switch>
            <AuthorizedOnlyRoute path="/" exact component={Overview} />
       <AuthorizedOnlyRoute path="/link/:link" exact component={Statistics} />
        <AuthorizedOnlyRoute path="/link/:link/edit" exact component={EditLink} />
      <AuthorizedOnlyRoute path="/ip/:ip" exact component={IPOverview} />
  <AuthorizedOnlyRoute path="/logout" exact component={Logout} />
        <UnauthorizedOnlyRoute path={['/login', '/register']} exact component={AuthForm} />
     </Switch>
   </Router>
);

