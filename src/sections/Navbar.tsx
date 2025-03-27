import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { toggle } from "../redux/slices/navbarMenuSlice";
import { setFilter } from "../redux/slices/tasksSlice";

import DrawerHeader from "../components/DrawerHeader";
import RoundedDrawer from "../components/RoundedDrawer";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const open = useSelector((state: RootState) => state.navbarMenu.open);
  const currentFilter = useSelector((state: RootState) => state.tasks.filter);
  const dispatch = useDispatch<AppDispatch>();

  const navListItems = [
    { text: "All", icon: <CalendarMonthIcon /> },
    { text: "Today", icon: <TodayIcon /> },
    { text: "Next 7 Days", icon: <DateRangeIcon /> },
  ];

  const handleNavItemClick = (filterText: string) => {
    dispatch(setFilter(filterText));
    dispatch(toggle());
  };

  return (
    <RoundedDrawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={() => dispatch(toggle())}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" color="primary">
          Taskly
        </Typography>
        <AddTaskIcon color="primary" sx={{ ml: 1 }} />
      </DrawerHeader>
      <List>
        {navListItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={currentFilter === item.text}
              onClick={() => handleNavItemClick(item.text)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </RoundedDrawer>
  );
};

export default Navbar;
