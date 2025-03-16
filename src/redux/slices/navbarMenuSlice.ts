import { createSlice } from "@reduxjs/toolkit";

// Define the state type
interface NavbarMenu {
  open: boolean;
}

// Initial state
const initialState: NavbarMenu = {
  open: false,
};

const navbarMenuSlice = createSlice({
  name: "openMenu",
  initialState,
  reducers: {
    toggle: (state) => {
      state.open = !state.open;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { toggle, setOpen } = navbarMenuSlice.actions;

export default navbarMenuSlice.reducer;
