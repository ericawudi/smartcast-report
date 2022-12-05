import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupAdd from "@material-ui/icons/GroupAdd";
import SupervisedUserCircle from "@material-ui/icons/SupervisedUserCircle";
import Button from "@material-ui/core/Button";
import { GetPrivilege, Logout } from "../auth/authService";
import Client from "./client";
import Admin from "./admin";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(Number);
  const [user, setUserPrivilege] = useState({
    username: String,
    privilege: Number,
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    Logout();
    props.history.replace("/");
  };

  // Get user privilege
  useEffect(() => {
    async function getPriv() {
      const resp = await GetPrivilege();
      setUserPrivilege({
        username: resp.username,
        privilege: parseInt(resp.privilege),
      });
      setPage(parseInt(resp.privilege));
    }
    getPriv();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ backgroundColor: "#2196f3" }}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <Button
            variant="outlined"
            style={{
              color: "#fff",
              fontWeight: "bold",
              backgroundColor: "#1769aa",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {user.privilege === 1 && (
          <div>
            <List>
              <ListItem
                button
                key={"Organizer"}
                selected={page === 1}
                onClick={() => setPage(1)}
              >
                <ListItemIcon>
                  <SupervisedUserCircle style={{ fontSize: "40px" }} />
                </ListItemIcon>
                <ListItemText primary={"Competition Report"} />
              </ListItem>

              <ListItem
                button
                selected={page === 0}
                key={"Contestant"}
                onClick={() => setPage(0)}
              >
                <ListItemIcon>
                  <GroupAdd style={{ fontSize: "40px" }} />
                </ListItemIcon>
                <ListItemText primary={"Category Report"} />
              </ListItem>
            </List>
          </div>
        )}

        {user.privilege === 0 && (
          <List>
            <ListItem button key={"Contestant"} selected>
              <ListItemIcon>
                <GroupAdd style={{ fontSize: "40px" }} />
              </ListItemIcon>
              <ListItemText primary={"Contestant"} />
            </ListItem>
          </List>
        )}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === 1 && <Admin {...props} user={user} />}
        {page === 0 && <Client {...props} user={user} />}
      </main>
    </div>
  );
}
