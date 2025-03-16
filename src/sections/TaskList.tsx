import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { toggle } from "../redux/slices/navbarMenuSlice";
import { createTask, getTasks } from "../redux/slices/tasksSlice";

import AppBar from "../components/AppBar";
import DrawerHeader from "../components/DrawerHeader";
import Main from "../components/Main";
import Task from "../components/Task";

import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useState } from "react";

const TaskList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const open = useSelector((state: RootState) => state.navbarMenu.open);
  const currentFilter = useSelector((state: RootState) => state.tasks.filter);
  const dispatch = useDispatch<AppDispatch>();

  const [taskName, setTaskName] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() === "") return;
    dispatch(createTask({ name: taskName, description: "", dueDate: "" })).then(
      () => {
        dispatch(getTasks());
      }
    );
    setTaskName("");
  };

  const handleRefreshTasks = () => {
    dispatch(getTasks());
  };

  return (
    <>
      <AppBar
        position="absolute"
        color="transparent"
        elevation={0}
        open={open && !isMobile}
        sx={{ mt: 2 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(toggle())}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: "1" }}
          >
            {currentFilter}
          </Typography>
          <IconButton edge="end" onClick={handleRefreshTasks} sx={{ mr: 1 }}>
            <AutorenewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open || isMobile}>
        <DrawerHeader />
        <form onSubmit={handleAddTask}>
          <Box sx={{ display: "flex", alignItems: "stretch", my: 2, gap: 1 }}>
            <TextField
              placeholder="Add Task"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            ></TextField>
            <Button type="submit" variant="contained">
              <AddIcon />
            </Button>
          </Box>
        </form>
        <Task />
      </Main>
    </>
  );
};

export default TaskList;
