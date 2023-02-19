import Box from "@mui/material/Box";
import React from "react";

import { QuickStart } from "@/containers/QuickStart";
import { useQuickStart } from "@/lib/hooks/useQuickStart";
import { withBrawlbackBackground } from "@/styles/withBrawlbackBackground";

const isDevelopment = window.electron.common.isDevelopment;

export const LandingView: React.FC = () => {
  const { allSteps, currentStep, nextStep, prevStep } = useQuickStart();
  return (
    <Box css={withBrawlbackBackground} display="flex" style={{ height: "100%", width: "100%" }}>
      <QuickStart
        allSteps={allSteps}
        currentStep={currentStep}
        onNext={isDevelopment ? nextStep : undefined}
        onPrev={isDevelopment ? prevStep : undefined}
      />
    </Box>
  );
};
