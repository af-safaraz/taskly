// import { useState } from 'react'
import Box from "@mui/material/Box";
import Navbar from "./sections/Navbar";
import TaskList from "./sections/TaskList";
import TaskDetail from "./sections/TaskDetail";
import CssBaseline from "@mui/material/CssBaseline";
// import './App.css'

function App() {
  return (
    <>
      <CssBaseline>
        <Box sx={{ display: "flex" }}>
          <Navbar></Navbar>
          <TaskList></TaskList>
          <TaskDetail></TaskDetail>
        </Box>
      </CssBaseline>
    </>
  );
}

export default App;
