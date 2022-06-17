import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

export interface SettingItemProps {
  name: React.ReactNode | string;
  description?: React.ReactNode | string;
}

export const SettingItem: React.FC<SettingItemProps> = (props) => {
  return (
    <Paper sx={{ margin: "20px 0", padding: "15px" }}>
      <Box sx={{ paddingBottom: "10px", display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ textTransform: "capitalize", fontWeight: "bold" }}>
          {props.name}
        </Typography>
        {props.description && (
          <Tooltip title={props.description}>
            <InfoIcon sx={{ marginLeft: "5px", fontSize: "20px" }} />
          </Tooltip>
        )}
      </Box>
      {props.children}
    </Paper>
  );
};
