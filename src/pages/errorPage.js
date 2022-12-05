import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Logout } from "../auth/authService";
import ErrorMessage from "../components/errorMessage";

export default function ErrorPage(props) {
  const handleLogout = () => {
    Logout();
    props.history.replace("/");
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <ErrorMessage
          style={{
            width: "400px",
            height: "300px",
            color: "#f44336",
          }}
        />
      </Grid>
      <Grid item style={{ marginTop: "5%" }}>
        <Button color="secondary" variant="outlined" onClick={handleLogout}>
          Kindly Login again
        </Button>
      </Grid>
    </Grid>
  );
}
