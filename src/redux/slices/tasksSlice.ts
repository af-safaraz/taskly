import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "../../api/taskAPI";

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  selectedTask: Task | null;
  isDetailOpen: boolean;
  filter: string;
}

const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
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
  const todayLocal = new Date();

  const todayUTC = new Date(
    Date.UTC(
      todayLocal.getFullYear(),
      todayLocal.getMonth(),
      todayLocal.getDate()
    )
  );

  const nextWeekUTC = new Date(todayUTC);
  nextWeekUTC.setDate(todayUTC.getDate() + 6);

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setUTCHours(0, 0, 0, 0);
    if (filter === "Today") {
      return taskDate.getTime() === todayUTC.getTime();
    }

    if (filter === "Next 7 Days") {
      return taskDate >= todayUTC && taskDate <= nextWeekUTC;
    }
    return true;
  });

  return filteredTasks;
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
      state.filteredTasks = applyFilter(state.tasks, action.payload);
    },
    editTaskOptimistic: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      const filteredTask = state.filteredTasks.find(
        (task) => task.id === action.payload.id
      );
      if (task && filteredTask) {
        Object.assign(task, action.payload.updates);
        Object.assign(filteredTask, action.payload.updates);
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
        state.filteredTasks = applyFilter(action.payload, state.filter);
        state.filteredTasks = action.payload.sort((a: Task, b: Task) => {
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
        const { id, updates } = action.meta.arg;
        const task = state.tasks.find((task) => task.id === id);
        if (task) {
          Object.assign(task, updates);
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
