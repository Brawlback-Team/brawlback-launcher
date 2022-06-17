import Box from "@mui/material/Box";
import React from "react";

import { usePageScrollingShortcuts } from "@/lib/hooks/useShortcuts";

import { NewsFeed } from "./NewsFeed";

export const HomePage = React.memo(function HomePage() {
  const mainRef = React.createRef<HTMLDivElement>();
  usePageScrollingShortcuts(mainRef);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        position: "relative",
        height: "95%",
      }}
    >
      <NewsFeed />
    </Box>
  );
});
