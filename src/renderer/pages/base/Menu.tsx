import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BrawlbackLogo from "../../styles/images/brawlback_padding_dark.png";
const drawerWidth = 270;

enum menuOption {
  Home,
  ReplaysBrawl,
  ReplaysPPlus,
  Settings,
}

export default function Menu() {
  const [openReplayMenu, handleOpenReplayMenu] = useState(true);
  const navigate = useNavigate();
  const currentUrl = useLocation();

  const handleButtonClick = (_: React.MouseEvent, option: menuOption) => {
    switch (option) {
      case menuOption.Home:
        navigate("/");
        break;
      case menuOption.ReplaysBrawl:
        navigate("replays?vBrawl");
        break;
      case menuOption.ReplaysPPlus:
        navigate("replays?P+");
        break;
      case menuOption.Settings:
        navigate("settings");
        break;
      default:
        break;
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          overflowX: "hidden",
        },
      }}
      variant="permanent"
      anchor="left"
      PaperProps={{ elevation: 9 }}
    >
      <Box sx={{ textAlign: "center", marginBottom: "5px" }}>
        <img src={BrawlbackLogo} width={200} height={200} />
      </Box>
      <Typography sx={{ fontSize: 22, marginLeft: "5px" }} variant="subtitle1">
        <List>
          <ListItem
            button
            selected={currentUrl.pathname === "/"}
            onClick={(ev) => handleButtonClick(ev, menuOption.Home)}
          >
            {" "}
            <Typography sx={{ fontSize: 22, fontFamily: "Mulish" }}>Home</Typography>
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleOpenReplayMenu(!openReplayMenu)}>
            <Typography sx={{ fontSize: 22, fontFamily: "Mulish" }}>Replays</Typography>
            {openReplayMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Divider />
          <Collapse in={openReplayMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ paddingLeft: 0, marginLeft: 4, borderLeft: 1 }}
                selected={currentUrl.pathname === "/replays" && currentUrl.search === "?P+"}
                onClick={(ev) => handleButtonClick(ev, menuOption.ReplaysPPlus)}
              >
                <Typography sx={{ fontSize: 22, paddingLeft: 1, fontWeight: "bold", fontFamily: "Mulish" }}>
                  P+
                </Typography>
              </ListItem>
              <ListItem
                button
                sx={{ paddingLeft: 0, marginLeft: 4, borderLeft: 1 }}
                selected={currentUrl.pathname === "/replays" && currentUrl.search === "?vBrawl"}
                onClick={(ev) => handleButtonClick(ev, menuOption.ReplaysBrawl)}
              >
                <Typography sx={{ fontSize: 22, paddingLeft: 1, fontWeight: "bold", fontFamily: "Mulish" }}>
                  vBrawl
                </Typography>
              </ListItem>
            </List>
            <Divider />
          </Collapse>
          <ListItem
            button
            selected={currentUrl.pathname === "/settings"}
            onClick={(ev) => handleButtonClick(ev, menuOption.Settings)}
          >
            <Typography sx={{ fontSize: 22, fontWeight: "bold", fontFamily: "Mulish" }}>Settings</Typography>
          </ListItem>
        </List>
      </Typography>
    </Drawer>
  );
}
