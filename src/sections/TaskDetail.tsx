import RoundedDrawer from "../components/RoundedDrawer";
import DrawerHeader from "../components/DrawerHeader";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  closeDetail,
  editTask,
  removeTask,
  Task,
} from "../redux/slices/tasksSlice";
import { useState, useEffect } from "react";

const TaskDetail = () => {
  const { selectedTask, isDetailOpen } = useSelector(
    (state: RootState) => state.tasks
  );

  const dispatch = useDispatch<AppDispatch>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const initialTaskState: Task = {
    id: "",
    name: "",
    description: "",
    completed: false,
    dueDate: "",
  };

  const [task, setTask] = useState<Task>(selectedTask || initialTaskState);

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    } else {
      setTask(initialTaskState);
    }
  }, [selectedTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setTask((prev) => ({
      ...prev,
      dueDate: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task || !selectedTask) return;
    const now = dayjs();
    let dueDateTime = "";
    if (task.dueDate !== "") {
      dueDateTime = dayjs(`${task.dueDate}T${now.format("HH:mm:ss")}`).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
    }
    dispatch(
      editTask({
        id: selectedTask.id,
        updates: { ...task, dueDate: dueDateTime },
      })
    );
    dispatch(closeDetail());
  };

  const handleDeleteTask = (id: string) => {
    if (id === "") {
      return;
    }
    dispatch(removeTask(id));
    setDelDialogOpen(false);
    dispatch(closeDetail());
  };

  const [delDialogOpen, setDelDialogOpen] = useState(false);

  return (
    <>
      <RoundedDrawer
        open={isDetailOpen}
        variant="temporary"
        drawerWidth={isMobile ? "90%" : 500}
        anchor="right"
        onClose={() => dispatch(closeDetail())}
      >
        <form onSubmit={handleSubmitEdit} style={{ height: "100%" }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <DrawerHeader sx={{ px: 3 }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h5">Task:</Typography>
                  <IconButton onClick={() => dispatch(closeDetail())}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DrawerHeader>
              <Stack spacing={2} sx={{ px: 3, py: 1 }}>
                <TextField
                  name="name"
                  variant="outlined"
                  multiline
                  label="Task Name"
                  fullWidth
                  value={task?.name}
                  onChange={handleInputChange}
                />
                <TextField
                  name="description"
                  label="Task Description"
                  multiline
                  rows={4}
                  value={task?.description}
                  onChange={handleInputChange}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="dueDate"
                    format="DD/MM/YYYY"
                    label="Due Date"
                    value={task?.dueDate ? dayjs.utc(task?.dueDate) : null}
                    onChange={handleDateChange}
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {task?.dueDate && (
                                  <IconButton
                                    onClick={() => handleDateChange(null)}
                                    size="small"
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                )}
                                {params.InputProps?.endAdornment}
                              </>
                            ),
                          }}
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Stack>
            </Box>

            <Box sx={{ p: 3, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                size="large"
                fullWidth
                onClick={() => setDelDialogOpen(true)}
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Save
              </Button>
            </Box>
          </Box>
        </form>
        <Dialog
          open={delDialogOpen}
          onClose={() => setDelDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDelDialogOpen(false)}
              sx={{ color: "grey" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleDeleteTask(selectedTask ? selectedTask.id : "")
              }
              autoFocus
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </RoundedDrawer>
    </>
  );
};

export default TaskDetail;
