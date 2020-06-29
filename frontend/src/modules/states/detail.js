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
import { useParams, Link } from 'react-router-dom';

const PaddingPaper = styled(Paper)({
  padding: 12,
});

const fullWidth = { width: '100%' };

const graphs = [
  '_active_cases.png',
  '_deaths_per_day.png',
  '_tests_per_day.png',
  '_new_cases_per_day.png',
  '_cases_and_tests_scatter.png',
  '_cases_to_tests_ratio.png',
  '_cumulative_cases.png',
  '_new_tests_and_cases.png',
  '_cumulative_deaths.png',
  '_new_cases_and_deaths.png',
];

export const Detail = () => {
  const { state } = useParams();
  const stateObject = states.find((({ abbreviation }) => state.toLowerCase() === abbreviation.toLowerCase()));

  return (
    <Container>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button>Back</Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">{stateObject.name}</Typography>
        </Grid>
        {
          graphs.map((graph) => (
            <Grid item xs={12} md={6} sm={6} key={`$${state}${graph}`}>
              <PaddingPaper>
                <img
                  src={`images/${stateObject.abbreviation}/${stateObject.abbreviation}${graph}`}
                  style={fullWidth}
                  alt={`$${state}, ${graph}`}
                />
              </PaddingPaper>
            </Grid>
          ))
        }
      </Grid>
    </Container>
  );
};
