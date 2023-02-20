import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AppBar from "@mui/material/AppBar";
//import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";

import { MeleeOptions } from "@/containers/Settings/MeleeOptions";
import { ModsOptions } from "@/containers/Settings/ModsOptions";

const tabSwitch = (index: number) => {
  switch (index) {
    case 0:
      return <MeleeOptions />;
    case 1:
      return <ModsOptions />;
    default:
      return <Box></Box>;
  }
};

const SettingsPage = () => {
  const [tabVal, setTabVal] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" sx={{ borderRadius: "20px", backgroundColor: "background.paper" }}>
        <Tabs
          value={tabVal}
          onChange={(_, value: number) => setTabVal(value)}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="settings tabs"
          sx={{ width: "95%", margin: "0 auto" }}
        >
          <Tab label="General" />
          <Tab label="Mods" icon={<SportsEsportsIcon />} />
          <Tab label="Netplay" />
          <Tab label="Replays" />
        </Tabs>
      </AppBar>

      <Box
        sx={{
          width: {
            xs: "95%",
            sm: "90%",
          },
          margin: "0 auto",
        }}
      >
        {tabSwitch(tabVal)}
      </Box>
    </Box>
  );
};

export default SettingsPage;
