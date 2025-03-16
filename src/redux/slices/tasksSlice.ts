import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "../../api/taskAPI";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

interface TasksState {
  tasks: Task[];
  filteredTask: Task[];
  loading: boolean;
  selectedTask: Task | null;
  isDetailOpen: boolean;
  filter: string;
}

const initialState: TasksState = {
  tasks: [],
  filteredTask: [],
  loading: false,
  selectedTask: null,
  isDetailOpen: false,
  filter: "All",
};

// Async Thunks
export const getTasks = createAsyncThunk("tasks/getTasks", async () => {
  return await fetchTasks();
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({
    name,
    description,
    dueDate,
  }: {
    name: string;
    description?: string;
    dueDate?: string;
  }) => {
    return await addTask({
      name,
      description,
      dueDate,
      completed: false,
    });
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    return await updateTask(id, updates);
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string) => {
    await deleteTask(id);
    return id;
  }
);

const applyFilter = (tasks: Task[], filter: string): Task[] => {
  dayjs.extend(utc);
  // const todayLocal = new Date();

  // const todayUTC = new Date(
  //   Date.UTC(
  //     todayLocal.getFullYear(),
  //     todayLocal.getMonth(),
  //     todayLocal.getDate()
  //   )
  // );

  // const nextWeekUTC = new Date(todayUTC);
  // nextWeekUTC.setDate(todayUTC.getDate() + 6);

  const todayUTC = dayjs.utc().startOf("day");
  const nextWeekUTC = todayUTC.add(6, "day");

  const filteredTask = tasks.filter((task) => {
    // const taskDate = new Date(task.dueDate);
    // taskDate.setUTCHours(0, 0, 0, 0);
    const taskDate = dayjs.utc(task.dueDate).startOf("day");
    if (filter === "Today") {
      // return taskDate.getTime() === todayUTC.getTime();
      return taskDate.isSame(todayUTC, "day");
    }

    if (filter === "Next 7 Days") {
      // return taskDate >= todayUTC && taskDate <= nextWeekUTC;
      return (
        taskDate.isSame(todayUTC, "day") ||
        (taskDate.isAfter(todayUTC) && taskDate.isBefore(nextWeekUTC))
      );
    }
    return true;
  });

  return filteredTask;
};

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    selectTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
      state.isDetailOpen = true;
    },
    closeDetail: (state) => {
      state.isDetailOpen = false;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.filteredTask = applyFilter(state.tasks, action.payload);
    },
    editTaskOptimistic: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.filteredTask = applyFilter(action.payload, state.filter);
        state.filteredTask = action.payload.sort((a: Task, b: Task) => {
          if (a.completed !== b.completed) {
            return Number(a.completed) - Number(b.completed);
          }
          // Handle empty dueDate cases
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

          return dateA - dateB;
        });
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(editTask.rejected, (state, action) => {
        // Rollback the task if API update fails
        const { id, updates } = action.meta.arg; // Get the original optimistic updates
        const task = state.tasks.find((task) => task.id === id);
        if (task) {
          Object.assign(task, updates); // Revert to the previous state
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { selectTask, closeDetail, setFilter, editTaskOptimistic } =
  tasksSlice.actions;

export default tasksSlice.reducer;
