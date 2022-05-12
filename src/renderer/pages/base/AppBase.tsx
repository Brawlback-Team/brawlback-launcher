import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import Container from '@mui/material/Container';

import Menu from "./Menu";
import UserHeader from './UserHeader';
import PlayButton from './PlayButton';

const AppBase = () => {
  return (
    <Box sx={{display: 'flex'}}>
      {/* Sidebar */}
      <Menu />
      <Box component='main' sx={{ display: 'block', width: '100%' }}>
        {/* Title and User Info */}
        <UserHeader />

        {/* Body Content */}
        <Container>
          <Outlet />
        </Container>
        <Box sx={{position: "absolute", bottom: 50, right: 50}}>
          <PlayButton />
        </Box>

      </Box>
    </Box>
  )
}

export default AppBase;