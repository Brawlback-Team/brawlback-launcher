import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import type { OpenDialogOptions } from "electron";
import React from "react";

export interface PathInputProps {
  onSelect: (filePath: string) => void;
  placeholder?: string;
  value?: string;
  options?: OpenDialogOptions;
  endAdornment?: JSX.Element;
  disabled?: boolean;
  tooltipText?: string;
  selectButton?: boolean;
}

export const PathInput = React.forwardRef<HTMLInputElement, PathInputProps>(
  (
    { value, placeholder, endAdornment, onSelect, options, disabled, tooltipText, selectButton = true }: PathInputProps,
    ref,
  ) => {
    //const { value, placeholder, endAdornment, onSelect, options, disabled, tooltipText } = props;
    const onClick = async () => {
      const result = await window.electron.common.showOpenDialog({ properties: ["openFile"], ...options });
      const res = result.filePaths;
      if (result.canceled || res.length === 0) {
        return;
      }
      onSelect(res[0]);
    };

    // const openPath = async () => {
    //   if (value)
    //     await window.electron.shell.openPath(value);
    // }

    return (
      <Outer>
        <Box
          sx={{
            padding: "2px",
            display: "flex",
            alignItems: "center",
            width: 300,
            flex: 1,
            borderRadius: 4,
            border: "2px solid grey",
          }}
        >
          <CustomInput inputRef={ref} readOnly value={value} placeholder={placeholder} />
          {endAdornment && (
            <React.Fragment>
              <Divider sx={{ height: "90%", margin: 0.5 }} orientation="vertical"></Divider>
              {endAdornment}
            </React.Fragment>
          )}
        </Box>
        {selectButton && (
          <Tooltip title={tooltipText ?? ""}>
            <span>
              <Button
                sx={{ marginLeft: "10px" }}
                color="secondary"
                variant="contained"
                onClick={onClick}
                disabled={disabled}
              >
                Select
              </Button>
            </span>
          </Tooltip>
        )}
      </Outer>
    );
  },
);

const CustomInput = styled(InputBase)`
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  font-size: 14px;
`;
const Outer = styled.div`
  display: flex;
`;
