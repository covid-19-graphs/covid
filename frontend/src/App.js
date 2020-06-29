import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Grid,
  Typography,
  InputBase,
} from"@material-ui/core";
import { styled } from"@material-ui/core";

import { List as StateList, Detail } from './modules/states';

const HeaderButton = styled(Button)({
  textDecoration: 'none',
  color: 'white',
  paddingLeft: 16,
  paddingRight: 16,
});
const SearchButton = styled(Button)({
  textDecoration: 'none',
  color: 'white',
  padding: 9,
  minWidth: 0,
});
const HeaderInput = styled(InputBase)({
  position: 'relative',
  borderRadius: 4,
  marginRight: 6,
  color: 'white',
  width: '100%',
  textAlign: 'center',
});

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/state/:state">
            <Detail />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <br />
        <br />
        <div style={{ marginTop: 32, marginBottom: 32, textAlign: 'center' }}>Data sourced from <a href="https://covidtracking.com" target="_blank" rel="noopener noreferrer">The COVID Tracking Project at The Atlantic</a> under the <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons License</a>.</div>
      </div>
    </Router>
  );
}

const Header = () => {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const onKeyDown = useCallback((e) => {
    if (e.keyCode === 13) {
      history.push(`/?query=${search}`);
    }
  }, [history, search]);

 return (
  <AppBar position="sticky">
    <Toolbar>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Typography variant="h4">
          <span role="img" aria-label="COVID-19 Data">😷</span>
        </Typography>
      </Link>
      <Link to={`/?query=${search}`} style={{ textDecoration: 'none' }}>
        <SearchButton>
        <span role="img" aria-label="Search">🔎</span>
        </SearchButton>
      </Link>
      <HeaderInput
        placeholder="Search…"
        value={search}
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Link to="/about" style={{ textDecoration: 'none' }}>
        <HeaderButton>
          About
        </HeaderButton>
      </Link>
    </Toolbar>
  </AppBar>
 );
}

function Home() {
  return <StateList />;
}

function About() {
  return (
    <Container>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">
            About the Project
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="body1">
            This project was created to provide context to conversations surrounding COVID-19 in the United States.
          </Typography>
          <Typography variant="body1">
            All data is updated daily.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">
            Creators
          </Typography>
          <br />
          <strong>Christopher Eppig</strong> - Analysis
          <br />
          <br />
          <strong>Jim Hall</strong> - Web Development
        </Grid>
      </Grid>
    </Container>
  );
}
