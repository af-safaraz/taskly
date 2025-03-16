import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Lexend Deca', sans-serif",
  },
  palette: {
    primary: {
      main: "#009688", // Custom primary color
    },
    // secondary: {
    //   main: "#ff4081", // Custom secondary color
    // },
  },
});

export default theme;
