import { useEffect } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { RootState, AppDispatch } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  getTasks,
  selectTask,
  editTask,
  editTaskOptimistic,
} from "../redux/slices/tasksSlice";
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const Task = () => {
  dayjs.extend(utc);
  const dispatch = useDispatch<AppDispatch>();
  const { filteredTasks, loading } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  // Handle task checkbox
  const handleTaskCheck = (id: string, completed: boolean) => {
    dispatch(editTaskOptimistic({ id, updates: { completed: !completed } }));
    dispatch(editTask({ id, updates: { completed: !completed } })).then(() => {
      dispatch(getTasks());
    });
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Divider />
      {loading && <p>Loading...</p>}
      {filteredTasks.map((task) => {
        const labelId = `checkbox-list-label-${task.id}`;
        const dateString = task.dueDate;
        const today = dayjs.utc().format("DD/MM/YYYY");
        const tomorrow = dayjs.utc().add(1, "day").format("DD/MM/YYYY");
        let formattedDate = dayjs.utc(dateString).format("DD/MM/YYYY");
        if (today === formattedDate) {
          formattedDate = "Today";
        } else if (tomorrow === formattedDate) {
          formattedDate = "Tomorrow";
        }

        return (
          <React.Fragment key={task.id}>
            <ListItem disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => dispatch(selectTask(task))}
              >
                <ListItemIcon>
                  <span>
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {
                        handleTaskCheck(task.id, task.completed);
                      }}
                      edge="start"
                      checked={task.completed}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      color="primary"
                    />
                  </span>
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={task.name}
                  secondary={task.dueDate ? formattedDate : ""}
                  sx={{
                    color: task.completed ? "#bdbdbd" : "inherit",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
                <KeyboardArrowRightIcon color="disabled" />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default Task;
