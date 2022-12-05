import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Signupform from "../components/signupform";

function Signup(props) {
  return (
    <div className="signup">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            style={{
              padding: "10%",
              paddingTop: "5%",
            }}
          >
            <Signupform {...props} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Signup;
