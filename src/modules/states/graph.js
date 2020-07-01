import React from 'react';
import {
  Button,
  Grid,
  Paper,
  Container,
} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import states from './states.json';
import { useParams, Link } from 'react-router-dom';

const PaddingPaper = styled(Paper)({
  padding: 32,
  cursor: 'pointer',
  maxWidth: 800,
  margin: '0 auto',
});

const fullWidth = { width: '100%' };

export const Graph = () => {
  const { state, graph } = useParams();
  const stateObject = states.find((({ abbreviation }) => state.toLowerCase() === abbreviation.toLowerCase()));

  return (
    <Container>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link to={`/state/${state}`} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">All States / {state.toUpperCase()}</Button>
          </Link>
        </Grid>
        <Grid item xs={12} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <PaddingPaper>
            <img
              src={`images/${stateObject.abbreviation}/${stateObject.abbreviation}${graph}`}
              style={fullWidth}
              alt={`$${state}, ${graph}`}
            />
          </PaddingPaper>
        </Grid>
      </Grid>
    </Container>
  );
};
