import "../src/renderer/styles/styles.scss"

import { meleeTheme } from "../src/renderer/styles/theme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import React from 'react';
import { addDecorator } from "@storybook/react";


addDecorator((story) => {
  return (
    <MuiThemeProvider theme={meleeTheme}>{story()}</MuiThemeProvider>
  );
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
