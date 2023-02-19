import { IsoValidity } from "@common/types";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Help from "@mui/icons-material/Help";
import type { PaletteMode } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React from "react";

import { PathInput } from "@/components/PathInput";
import { useDolphinStore } from "@/lib/dolphin/useDolphinStore";
import { useIsoVerification } from "@/lib/hooks/useIsoVerification";
import { useIsoPath, useLaunchBrawlOnPlay, useThemeMode } from "@/lib/hooks/useSettings";

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

export const BrawlOptions: React.FC = () => {
  const verifying = useIsoVerification((state) => state.isValidating);
  const isoValidity = useIsoVerification((state) => state.validity);
  const [isoPath, setIsoPath] = useIsoPath();
  const [launchBrawlOnPlay, setLaunchBrawl] = useLaunchBrawlOnPlay();
  const [themeMode, setThemeMode] = useThemeMode();
  const netplayDolphinOpen = useDolphinStore((store) => store.netplayOpened);
  const playbackDolphinOpen = useDolphinStore((store) => store.playbackOpened);

  const onLaunchBrawlChange = async (value: string) => {
    const launchBrawl = value === "true";
    await setLaunchBrawl(launchBrawl);
  };

  return (
    <div>
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
            <ValidationContainer className={verifying ? undefined : isoValidity.toLowerCase()}>
              <span
                css={css`
                  text-transform: capitalize;
                  margin-right: 5px;
                  font-weight: 500;
                `}
              >
                {verifying ? "Verifying..." : isoValidity.toLowerCase()}
              </span>
              {verifying ? <CircularProgress size={25} color="inherit" /> : renderValidityStatus(isoValidity)}
            </ValidationContainer>
          }
        />
      </SettingItem>

      <SettingItem name="Theme" description="Whether launcher should use light or dark mode">
        <RadioGroup row value={themeMode} onChange={(_event, value) => setThemeMode(value as PaletteMode)}>
          <FormControlLabel value="dark" label="Dark" control={<Radio />} />
          <FormControlLabel value="light" label="Light" control={<Radio />} />
        </RadioGroup>
      </SettingItem>

      <SettingItem name="Play Button Action" description="Choose what happens when the Play button is pressed.">
        <RadioGroup row value={launchBrawlOnPlay} onChange={(_event, value) => onLaunchBrawlChange(value)}>
          <FormControlLabel value={true} label="Launch Brawl" control={<Radio />} />
          <FormControlLabel value={false} label="Launch Dolphin" control={<Radio />} />
        </RadioGroup>
      </SettingItem>
    </div>
  );
};

const ValidationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: white;
  &.invalid {
    color: ${({ theme }) => theme.palette.error.main};
  }
  &.valid {
    color: ${({ theme }) => theme.palette.success.main};
  }
`;
