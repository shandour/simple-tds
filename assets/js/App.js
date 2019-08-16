import React from 'react';

import Routes from './Routes';
import LoginChecker from './components/LoginChecker';
import { axios } from './axios';


export const UserContext = React.createContext(null);

class App extends React.Component {
  constructor(props) {
      super(props);

      this.getCountries = async () => {
          try {
              const res = await axios.get('get-countries/');
              if (res.data && res.data.length) {
                  this.setState({
                      countries: res.data,
                  });
              }
          } catch (e) {
              console.log(e);
          }
      };

    this.login = user => {
      this.setState({
        isLoggedIn: true,
         user,
      });
        const {countries} = this.state;
        if (!countries.length) {
            this.getCountries();
        }
    };

    this.logout = () => {
      this.setState({
        isLoggedIn: false,
         user: null,
      });
      localStorage.removeItem("token");
    };

    this.state = {
      isLoggedIn: false,
      user: null,
      login: this.login,
        logout: this.logout,
        countries: [],
    };
            
            // monkey-patched to logout on 401
            axios.interceptors.response.use(
            async response => response,
            async (error) => {
                const token = localStorage.getItem('token');
                if (error.response.status === 401) {
                  this.logout();
                }
                return Promise.reject(error);
            });
  }

  render() {
      return (
              <UserContext.Provider value={this.state}>
              <LoginChecker>
              <Routes />
              </LoginChecker>
              </UserContext.Provider>
    );
  }
}


export default App;
