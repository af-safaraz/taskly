// import { useState } from 'react'
import Container from "@mui/material/Container";
import * as React from "react";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Navbar from "./sections/Navbar";
import TaskList from "./sections/TaskList";
import TaskDetail from "./sections/TaskDetail";
import { grey } from "@mui/material/colors";
// import './App.css'

// function App() {
// const [count, setCount] = useState(0)

// return (
// <>
// <Container>
//   <Navbar></Navbar>
//   <TaskList></TaskList>
//   <TaskDetail></TaskDetail>
// </Container>
// </>
//   )
// }

const drawerWidth = 260;

// Custom style to add margin left to main when drawer open
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth + 32}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// Custom style to add margin left to App Bar when drawer open
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth + 32}px)`,
        marginLeft: `${drawerWidth + 32}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

// Adding Space to Drawer so it match the AppBar
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const RoundedDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  margin: theme.spacing(2),
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: grey[100],
    border: "none",
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 3,
    height: "calc(100vh - 32px)",
  },
}));

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  // List task
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="transparent"
        open={open && !isMobile}
        elevation={0}
        sx={{ mt: 2 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              // open && { display: 'none' },
            ]}
          >
            {/* <MenuIcon /> */}
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            Today
          </Typography>
        </Toolbar>
      </AppBar>
      <RoundedDrawer
        // sx={{
        //   width: drawerWidth,
        //   margin: 2,
        //   flexShrink: 0,
        //   "& .MuiDrawer-paper": {
        //     width: drawerWidth,
        //     boxSizing: "border-box",
        //     backgroundColor: grey[100],
        //     border: "none",
        //     margin: 2,
        //     borderRadius: 3,
        //     height: "calc(100vh - 32px)",
        //   },
        // }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="primary">
            TinyTask
          </Typography>
          <AddTaskIcon color="primary" sx={{ ml: 1 }} />
        </DrawerHeader>
        <List>
          {["All", "Today", "Next 7 Days"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {(() => {
                    switch (text) {
                      case "All":
                        return <CalendarMonthIcon />;
                      case "Today":
                        return <TodayIcon />;
                      case "Next 7 Days":
                        return <DateRangeIcon />;
                      default:
                        return null;
                    }
                  })()}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </RoundedDrawer>
      <Main open={open || isMobile}>
        <DrawerHeader />
        <Box sx={{ py: 1 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Add Task"
            variant="outlined"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AddIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Divider />
            {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <>
                  <ListItem key={value} disablePadding>
                    <ListItemButton role={undefined}>
                      <ListItemIcon>
                        <Checkbox
                          onClick={handleToggle(value)}
                          edge="start"
                          checked={checked.includes(value)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={`Line item ${value + 1}`}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              );
            })}
          </List>
        </Box>
      </Main>
      {/* <RoundedDrawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 360,
          "& .MuiDrawer-paper": {
            width: 360,
          },
        }}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Task:</Typography>
        </DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
          <Checkbox />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mr: 2 }}
          />
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            fullWidth
          />
        </Box>
      </RoundedDrawer> */}
    </Box>
  );
};

export default App;
