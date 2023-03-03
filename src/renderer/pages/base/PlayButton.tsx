import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";

import { useDolphinActions } from "@/lib/dolphin/useDolphinActions";
import { useModsList } from "@/lib/hooks/useMods";
import { useServices } from "@/services";

const PlayButton = () => {
  const { dolphinService } = useServices();
  const { launchNetplay } = useDolphinActions(dolphinService);
  const [menuAnchor, setAnchor] = useState<null | HTMLElement>(null);
  const [modList, _addMod, _deleteMod, selectMod, getSelectedMod] = useModsList();
  const onChangeMod = async (index: number) => {
    //dispatch({type: 'SELECT_LAUNCHER', index: index})
    await selectMod(index);
    setAnchor(null);
  };

  const onHitPlay: React.MouseEventHandler = async () => {
    // window.api.send("runDolphin").then((data) => {
    //   console.log(data);
    // });
    // In case settings are changed before running
    await selectMod(getSelectedMod());
    launchNetplay();
    console.log("play");
  };

  return (
    <Box sx={{ position: "relative", width: "fit-content" }}>
      <IconButton
        sx={{ width: 100, height: 100, bgcolor: "primary.main", filter: "drop-shadow(0px 7px 5px #000000)" }}
        onClick={onHitPlay}
      >
        <PlayArrowIcon sx={{ fontSize: 100 }}></PlayArrowIcon>
      </IconButton>
      {modList.length > 0 && (
        <Box
          sx={{
            borderRadius: "50%",
            width: 45,
            height: 45,
            bgcolor: "primary.main",
            display: "flex",
            position: "absolute",
            top: 65,
            left: 70,
            filter: "drop-shadow(0px 4px 5px #000000)",
            fontWeight: "bold",
            textAlign: "center",
          }}
          onClick={(event) => {
            setAnchor(event.currentTarget);
          }}
        >
          <Box component="p" sx={{ width: "100%", lineHeight: 1 }}>
            {modList[getSelectedMod()].name.substring(0, 2)}
          </Box>
        </Box>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor != null}
        onClose={() => {
          setAnchor(null);
        }}
      >
        {modList.map((value, index) => (
          <MenuItem key={index} onClick={async (_event) => await onChangeMod(index)}>
            {value.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default PlayButton;
