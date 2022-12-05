import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import MUIDataTable from "mui-datatables";
import { GetVotesByCategory } from "../auth/authService";
import { CircularProgress } from "@material-ui/core";

//
const columns = [
  {
    name: "contestant_name",
    label: "Contestant Name",
    options: {
      filter: false,
    },
  },
  {
    name: "category_name",
    label: "Category",
    options: {
      filter: true,
    },
  },
  {
    name: "shortcode",
    label: "Contestant Code",
    options: {
      filter: true,
    },
  },
  {
    name: "vote_count",
    label: "Number Of Votes",
    options: {
      filter: true,
    },
  },
];

//
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

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function VoteDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataController, setDataController] = React.useState("");

  const handleClickOpen = async () => {
    setSearch(true);
    if (props.ID !== "") {
      if (props.ID !== dataController) {
        const resp = await GetVotesByCategory(props.ID, props.action);
        if (resp !== undefined) {
          if (resp.status === 200 || resp.status === 201) {
            setData(resp.data);
          }
          setDataController(props.ID);
        }
      }
    }
    setOpen(true);
    setSearch(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="large"
        style={{ backgroundColor: "#2196f3" }}
        onClick={handleClickOpen}
        disabled={search}
      >
        {search && <CircularProgress size={13} />}
        All Votes
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <MUIDataTable
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "move",
              }}
              id="draggable-dialog-title"
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Nominee Vote Report
              </div>
            </div>
          }
          data={data}
          columns={columns}
          options={options}
        />
      </Dialog>
    </div>
  );
}

export default VoteDialog;
