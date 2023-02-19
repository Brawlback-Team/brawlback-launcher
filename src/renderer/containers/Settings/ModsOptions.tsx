import { IsoValidity } from "@common/types";
import type { Mod } from "@mods/types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import Help from "@mui/icons-material/Help";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { PathInput } from "@/components/PathInput";
import { useDolphinStore } from "@/lib/dolphin/useDolphinStore";
import { useIsoVerification } from "@/lib/hooks/useIsoVerification";
import { useModsList } from "@/lib/hooks/useMods";
import { useIsoPath } from "@/lib/hooks/useSettings";

import { SettingItem } from "./SettingItem";

const renderValidityStatus = (isoValidity: IsoValidity) => {
  switch (isoValidity) {
    case IsoValidity.VALID: {
      return <CheckCircleIcon />;
    }
    case IsoValidity.UNKNOWN: {
      return <Help />;
    }
    case IsoValidity.INVALID:
    case IsoValidity.UNVALIDATED: {
      return <ErrorIcon />;
    }
  }
};

interface ModDisplayProps {
  mod: Mod;
  index: number;
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}
const ModDisplay: React.FC<ModDisplayProps> = ({ mod, index, onDelete, onEdit }: ModDisplayProps) => {
  return (
    <Paper sx={{ margin: "10px", padding: "5px" }} elevation={4}>
      <Box sx={{ display: "flex", alignItems: "row" }}>
        <Typography sx={{ marginLeft: "5px" }} variant="subtitle1">
          {mod.name}
        </Typography>
        <EditIcon onClick={() => onEdit(index)} />
        <DeleteIcon onClick={() => onDelete(index)} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "row" }}>
        <Box sx={{ width: "50%", margin: "10px" }}>
          <Typography variant="caption">Launcher</Typography>
          <PathInput selectButton={false} onSelect={(str) => console.log(str)} value={mod.elfPath} />
        </Box>
        <Box sx={{ width: "50%", margin: "10px" }}>
          <Typography variant="caption">SD Card</Typography>
          <PathInput selectButton={false} onSelect={(str) => console.log(str)} value={mod.sdCardPath} />
        </Box>
      </Box>
    </Paper>
  );
};

export const ModsOptions = () => {
  const verifying = useIsoVerification((state) => state.isValidating);
  const isoValidity = useIsoVerification((state) => state.validity);
  const [isoPath, setIsoPath] = useIsoPath();
  const [modList, addMod, deleteMod] = useModsList();

  const netplayDolphinOpen = useDolphinStore((store) => store.netplayOpened);
  const playbackDolphinOpen = useDolphinStore((store) => store.playbackOpened);

  const [openDialog, setOpenDialog] = useState(false);

  const [modName, setModName] = useState("");
  const [launcherPath, setLauncherPath] = useState("");
  const [sdCardPath, setSDCardPath] = useState("");

  const handleAddMod = async () => {
    await addMod({ name: modName, sdCardPath: sdCardPath, elfPath: launcherPath });
    setOpenDialog(false);
  };
  return (
    <Box>
      {/* ISO FILE INPUT */}
      <SettingItem name="Brawl ISO File" description="The path to a valid Brawl ISO.">
        <PathInput
          tooltipText={netplayDolphinOpen || playbackDolphinOpen ? "Close Dolphin to change this setting" : ""}
          value={isoPath !== null ? isoPath : ""}
          onSelect={setIsoPath}
          placeholder="No file set"
          disabled={verifying || netplayDolphinOpen || playbackDolphinOpen}
          options={{
            filters: [{ name: "Brawl ISO", extensions: ["iso", "gcm", "gcz"] }],
          }}
          endAdornment={
            <Box
              className={verifying ? undefined : isoValidity.toLowerCase()}
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
                color: "white",
                "&.invalid": {
                  color: "error.main",
                },
                "&.valid": {
                  color: "success.main",
                },
              }}
            >
              <Typography sx={{ textTransform: "capitalize", marginRight: "5px", fontWeight: 500 }}>
                {verifying ? "Verifying..." : isoValidity.toLowerCase()}
              </Typography>
              {verifying ? <CircularProgress size={25} color="inherit" /> : renderValidityStatus(isoValidity)}
            </Box>
          }
        />
      </SettingItem>

      {/* MOD LIST */}
      <SettingItem name="Mods List" description="Add or Remove Lylat enabled mods here">
        <Box>
          <NoteAddIcon onClick={() => setOpenDialog(true)} />
          {modList.map((val, index) => (
            <ModDisplay key={index} mod={val} index={index} onDelete={deleteMod} onEdit={(id) => console.log(id)} />
          ))}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Add Mod</DialogTitle>
            <DialogContent>
              <DialogContentText>add a new mod</DialogContentText>
              <TextField
                margin="dense"
                id="name"
                label="name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(ev) => setModName(ev.target.value)}
              />
              <TextField
                margin="dense"
                id="launcher"
                label="launcher"
                type="text"
                fullWidth
                variant="standard"
                onChange={(ev) => setLauncherPath(ev.target.value)}
              />
              <TextField
                margin="dense"
                id="sd-path"
                label="sd"
                type="text"
                fullWidth
                variant="standard"
                onChange={(ev) => setSDCardPath(ev.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleAddMod}>Subscribe</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </SettingItem>
    </Box>
  );
};
