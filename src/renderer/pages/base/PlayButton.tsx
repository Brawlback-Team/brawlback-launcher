import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//import { useQuery } from "react-query";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Mod } from '@settings/types';


const PlayButton = () => {
  const [menuAnchor, setAnchor] = useState<null | HTMLElement>(null);
  const [modList, setModList] = useState<Mod[]>([]);

  useEffect(() => {
    const getMods = async () => {
      window.electron.settings.getModsList().then((mods) => setModList(mods))
    }

    getMods();
  }, [])

  const onChangeMod = (_: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    //dispatch({type: 'SELECT_LAUNCHER', index: index})
    setAnchor(null);
  }

  const onHitPlay: React.MouseEventHandler = async () => {
    // window.api.send("runDolphin").then((data) => {
    //   console.log(data);
    // });
    console.log('play')
  }
  const thing = ["mod 1", "mod 2"]

  return (
    <Box sx={{position: "relative", width: "fit-content"}}>
      <IconButton sx={{width: 150, height: 150, bgcolor: "primary.main", filter: "drop-shadow(0px 7px 5px #000000)"}} onClick={onHitPlay}>
        <PlayArrowIcon sx={{fontSize: 150}}></PlayArrowIcon>
      </IconButton>
      <Box sx={{
          borderRadius: "50%",
          width: 45, height: 45, 
          bgcolor: "primary.main", 
          display: "flex",
          position: "absolute",
          bottom: 0,
          right: 0,
          filter: "drop-shadow(0px 4px 5px #000000)"
        }}
        onClick={(event) => {setAnchor(event.currentTarget)}}
      >
        {/* <p>{state.launchers[state.selectedLauncherIndex].name.substring(0,2)}</p> */}
        {modList.length > 0 && <p>{modList[0].name.substring(0,2)}</p>}
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor != null}
        onClose={() => {setAnchor(null)}}
      >
        {modList.map((value, index) => (
          <MenuItem key={index} onClick={(event) => onChangeMod(event, index)}>{value.name}</MenuItem>
        ))}
        {/* {thing.map((value, index) => (
          <MenuItem key={index} >{value}</MenuItem>
        ))} */}
      </Menu>
    </Box>
  )
}

export default PlayButton;