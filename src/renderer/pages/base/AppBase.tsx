import Container from "@mui/material/Container";
import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";

import Menu from "./Menu";
import PlayButton from "./PlayButton";
import UserHeader from "./UserHeader";

const AppBase = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", overflowY: "hidden" }}>
      {/* Sidebar */}
      <Menu />
      <Box sx={{ display: "block", width: "100%" }}>
        {/* Title and User Info */}
        <UserHeader />

        {/* Body Content */}
        <Container sx={{ height: "calc(100% - 90px)" }}>
          <Outlet />
        </Container>

        {/* Play Button and Mod Switcher */}
        <Box sx={{ position: "fixed", bottom: 50, right: 50 }}>
          <PlayButton />
        </Box>
      </Box>
    </Box>
  );
};

export default AppBase;
