import React from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Container,
} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import states from './states.json';
import { useLocation, Link } from 'react-router-dom';

const PaddingPaper = styled(Paper)({
  padding: 12,
  cursor: 'pointer',
  transition: 'transform 0.1s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

const fullWidth = { width: '100%' };

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const List = () => {
  const query = useQuery();
  const search = (query.get('query') || '').toLowerCase();
  const filteredStates = states.filter(({ abbreviation, name }) => {
    if (abbreviation.toLowerCase().indexOf(search) >= 0 || name.toLowerCase().indexOf(search) >= 0) return true;
    return false;
  });

  return (
    <Container>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Pick a state</Typography>
        </Grid>
        {
          filteredStates.map((state) => (
            <Grid item xs={12} md={4} sm={6} key={state.name}>
              <Link to={`/state/${state.abbreviation}`} style={{ textDecoration: 'none' }}>
                <PaddingPaper>
                  <Typography>
                    {state.name}
                  </Typography>
                  <img
                    src={`images/${state.abbreviation}/${state.abbreviation}_active_cases.png`}
                    style={fullWidth}
                  />
                </PaddingPaper>
              </Link>
            </Grid>
          ))
        }
      </Grid>
    </Container>
  );
};
