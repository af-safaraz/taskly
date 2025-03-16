import { styled } from "@mui/material/styles";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { grey } from "@mui/material/colors";
import { drawerMargin } from "../constants/constant";
// import { drawerMargin, drawerWidth } from "../constants/constant";

interface RoundedDrawerProps extends DrawerProps {
  drawerWidth?: number | string;
}

const RoundedDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "drawerWidth",
})<RoundedDrawerProps>(({ theme, drawerWidth = 260 }) => ({
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
    height: `calc(100% - ${drawerMargin}px)`,
  },
}));

export default RoundedDrawer;
