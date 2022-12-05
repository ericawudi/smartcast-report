import React, { useState } from "react";
import { Helmet } from "react-helmet";
import MUIDataTable from "mui-datatables";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useForm } from "react-hook-form";

import { GetCompetitionsAndCategoryVotes } from "../auth/authService";
import BarChartGraph from "../components/graph";
import { Paper, Snackbar } from "@material-ui/core";
import Notification from "../components/notification";
import VoteDialog from "./category";

//
const columns = [
  {
    name: "competition_id",
    label: "Competition ID ",
    options: {
      filter: false,
    },
  },
  {
    name: "participant_name",
    label: "Contestant Name",
    options: {
      filter: true,
    },
  },
  {
    name: "category",
    label: "Category",
    options: {
      filter: true,
    },
  },
  {
    name: "votes",
    label: "Number Of Votes",
    options: {
      filter: true,
    },
  },
];

const Admin = () => {
  const title = "SMARTCAST REPORT";
  const description = "SMARTCAST REPORT";
  const [display, setDisplay] = useState(true);
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [totalVotes, setTotalVotes] = useState("");
  const [startDate] = useState(new Date());
  const [endDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [search, setSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [notificationValues, setNotificationValues] = React.useState({
    success: "info",
    message: "",
    finish: false,
  });
  const { register, handleSubmit, errors, watch } = useForm();
  const ID = watch("competitionID");
  const options = {
    filterType: "textField",
    print: false,
    filter: false,
    responsive: "vertical",
    selectableRows: "none",
    viewColumns: true,
    downloadOptions: {
      filename: "nominee_vote_report.csv",
      separator: ",",
    },
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleNotificationClose = () => {
    setNotificationValues({
      ...notificationValues,
      finish: false,
    });
  };

  const onSubmit = async (data, e) => {
    if (e.target.id === "search-competition") {
      setSearch(true);
      const resp = await GetCompetitionsAndCategoryVotes(
        data,
        selectedCategory,
        categoryList
      );
      if (resp !== undefined) {
        if (resp.status === 200 || resp.status === 201) {
          if (selectedCategory === "" || selectedCategory === "all") {
            setDisplay(false);
          } else {
            setGraphData(resp.data);
            setDisplay(true);
          }
          setData(resp.data);
          setTotalVotes(resp.votes);
          setCategoryList(resp.category);
          if (resp.data.length < 1) {
            setNotificationValues({
              success: "warning",
              message: "No votes found for chosen duration and ID",
              finish: true,
            });
          }
        }
      } else {
        setNotificationValues({
          success: "error",
          message: "Error! Check Internet Connections or Contact Admin",
          finish: true,
        });
      }
      setDuration(" FROM " + data.startDate + " TO " + data.endDate);
      setSearch(false);
      //
    }
  };

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={{ marginBottom: "1%" }}>
            <Grid container spacing={5} justify="center" alignContent="center">
              <Grid item style={{ fontSize: "20px", fontWeight: "" }}>
                Overall Competition Report
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "1%" }}>
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={10}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                id="search-competition"
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      inputRef={register({
                        required: true,
                        minLength: 3,
                        pattern: {
                          value: /^[a-zA-Z0-9@_-\s]*$/,
                          message: "Name contains unacceptable characters",
                        },
                      })}
                      error={errors.competionID && true}
                      name="competitionID"
                      size="small"
                      label="Enter Competition ID"
                      margin="normal"
                      autoFocus
                      variant="outlined"
                      placeholder="Enter Competition ID"
                    />
                  </Grid>
                  {categoryList.length > 0 && (
                    <Grid item xs={6} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel id="selectedCategory">
                          Select Category
                        </InputLabel>

                        <Select
                          labelId="selectedCategory"
                          id="selectedCategory"
                          onChange={handleCategoryChange}
                          value={selectedCategory}
                        >
                          <MenuItem key={"all"} value="all">
                            All
                          </MenuItem>
                          {categoryList.map((category, _) => {
                            return (
                              <MenuItem
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.category_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={6} sm={2}>
                    <TextField
                      id="start-date"
                      name="startDate"
                      label="Start Date"
                      type="date"
                      defaultValue={startDate.toISOString().slice(0, 10)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputRef={register({
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      id="end-date"
                      name="endDate"
                      label="End Date"
                      type="date"
                      defaultValue={endDate.toISOString().slice(0, 10)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputRef={register({
                        required: true,
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      type="submit"
                      style={{ backgroundColor: "#2196f3" }}
                      disabled={search}
                    >
                      {search && <CircularProgress size={13} />}
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <VoteDialog ID={ID} action="getAllVote" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item sm={3}>
              <Paper
                style={{
                  display: "flex",
                  marginTop: "5%",
                  padding: "5%",
                  fontSize: "20px",
                  fontWeight: "bold",
                  justifyContent: "center",
                }}
              >
                Total Votes {totalVotes}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {display && (
          <Grid item xs={12} style={{ marginTop: "2%" }}>
            <BarChartGraph data={graphData} duration={duration} />
          </Grid>
        )}
        <Grid item xs={12} style={{ marginTop: "2%" }}>
          <MUIDataTable
            title={
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Nominee Vote Report
              </div>
            }
            data={data}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Snackbar
        className="notification"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={notificationValues.finish}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
      >
        <Notification
          onClose={handleNotificationClose}
          variant={notificationValues.success}
          message={notificationValues.message}
        />
      </Snackbar>
    </div>
  );
};

export default Admin;
