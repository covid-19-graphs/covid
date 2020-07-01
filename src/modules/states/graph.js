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
import { useParams, Link, useHistory } from 'react-router-dom';

const PaddingPaper = styled(Paper)({
  padding: 12,
  cursor: 'pointer',
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
            <Button>Back</Button>
          </Link>
        </Grid>
        <Grid item xs={0} md={2} sm={2} />
        <Grid item xs={12} md={8} sm={8}>
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
