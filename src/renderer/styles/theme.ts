import { colors } from "@common/colors";
import type { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
// default theme with correct primary color for accessing theme props in styleoverrides
const defaultTheme = createTheme({
  palette: {
    primary: { main: "#4CEBB4" },
  },
});

const getThemeOptions = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? // Theme for Light mode
        {
          primary: { main: "#4CEBB4" },
          text: {
            primary: "#000000",
            secondary: "#444444",
          },
          divider: "#000000",
          background: {
            default: "#FFFFFF",
            paper: "#CCCCCC",
          },
        }
      : // Theme for Dark mode
        {
          primary: { main: "#4CEBB4" },
          text: {
            primary: "#FFFFFF",
            secondary: "#DDDDDD",
          },
          divider: "#FFFFFF",
          background: {
            default: "#414242",
            paper: "#595A5A",
          },
        }),
  },
  // CSS Class Overrides for both themes
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            background: defaultTheme.palette.primary.main,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: defaultTheme.typography.fontWeightMedium,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            background: defaultTheme.palette.primary.dark,
          },
        },
      },
    },
    // REMOVING MuiAppBar as it is currently not something we use for brba theming, might be useful later
    // MuiAppBar: {
    //   variants: [
    //     {
    //       props: { variant: "rounded" },
    //       style: {
    //         borderRadius: '10px'
    //       }
    //     }
    //   ]
    // }
  },
});

export default getThemeOptions;

/* now starting legacy slippi code */
const legacyTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#E9EAEA",
      secondary: "#B4B4B4",
    },
    primary: {
      main: colors.greenPrimary,
    },
    secondary: {
      main: colors.purplePrimary,
    },
    divider: "rgba(255,255,255)",
    background: {
      paper: colors.purpleDarker,
      default: colors.purple,
    },
  },
  // REMOVING Typography as we are no longer importing all these fontFamilies.
  // This area was commented out before, uncommented as could be useful as a reference for building-out brawlback theme
  // typography: {
  //   fontFamily: rubikFont,
  //   fontSize: 16,
  //   h1: {
  //     fontFamily: mavenProFont,
  //   },
  //   h2: {
  //     fontFamily: mavenProFont,
  //   },
  //   h3: {
  //     fontFamily: mavenProFont,
  //   },
  //   h4: {
  //     fontFamily: mavenProFont,
  //   },
  //   h5: {
  //     fontFamily: mavenProFont,
  //   },
  //   h6: {
  //     fontFamily: mavenProFont,
  //   },
  //   caption: {
  //     opacity: 0.6,
  //   },
  // },
});

const addOverrides = (legacyTheme: Theme) => {
  return createTheme({
    ...legacyTheme,
    components: {
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          arrow: {
            color: colors.offWhite,
          },
          tooltip: {
            backgroundColor: colors.offWhite,
            color: colors.purpleDarker,
            boxShadow: legacyTheme.shadows[1],
            fontSize: 13,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
          fullWidth: true,
          size: "small",
        },
      },
      MuiRadio: {
        defaultProps: {
          color: "primary",
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "transparent",
          },
          rounded: {
            borderRadius: "10px",
            overflow: "hidden",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: "#1E1F25",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#dddddd",
            "&.Mui-focused": {
              color: "#ffffff",
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "initial",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            // fontFamily: rubikFont,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
          },
          contained: {
            fontWeight: 700,
            textTransform: "initial",
            borderRadius: "10px",
          },
          outlined: {
            textTransform: "initial",
            borderRadius: "10px",
          },
        },
      },
    },
  });
};

export const meleeTheme = addOverrides(legacyTheme);
