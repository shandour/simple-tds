import React from "react";
import Routes from './Routes';
import LoginChecker from './components/LoginChecker';
import { axios } from './axios';
import { GridThemeProvider } from 'styled-bootstrap-grid';
import { ThemeProvider } from 'styled-components';


export const UserContext = React.createContext(null);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.login = user => {
      this.setState({
        isLoggedIn: true,
         user,
      });
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
              <ThemeProvider
          theme={styledTheme}
              >
              <GridThemeProvider
          gridTheme={gridTheme}
              >
              <UserContext.Provider value={this.state}>
              <LoginChecker>
              <Routes />
              </LoginChecker>
              </UserContext.Provider>
              </GridThemeProvider>
              </ThemeProvider>
    );
  }
}

export default App;
