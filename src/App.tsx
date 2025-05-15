import { Divider, Grid, Paper } from "@mui/material";
import PrimeGenerator from "./shared/components/PrimeGenerator/PrimeGenerator.tsx";
import Entertainment from "./shared/components/Entertainment/Entertainment.tsx";
import "./App.css";

function App() {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} columns={12} flexWrap="nowrap">
          <Grid size={6}>
            <PrimeGenerator />
          </Grid>
          <Divider orientation="vertical" />
          <Grid size={6}>
            <Entertainment />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default App;
