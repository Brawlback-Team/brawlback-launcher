import "./styles/styles.scss";
import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import CssBaseline from '@mui/material/CssBaseline';
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter as Router, Navigate, useRoutes } from "react-router-dom";

import { useAppStore } from "@/lib/hooks/useApp";
import { useThemeMode } from "./lib/hooks/useSettings";

import { ToastProvider } from "./components/ToastProvider";
import { useAppListeners } from "./lib/hooks/useAppListeners";
import { ServiceProvider } from "./services";
import getThemeOptions from "./styles/theme";

import { LoadingView } from "./views/LoadingView";
import { SettingsView } from "./views/SettingsView";

import { AppBase } from "./pages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: false,
    },
  },
});

function Home() {
  return (
    <h3>Home</h3>
  )
}

function Replay() {
  return (
    <h3>Replay</h3>
  )
}

const routesObj = [
  {
    path: '/',
    element: <AppBase />,
    name: 'base',
    children: [
      {
        index: true,
        element: <Home />,
        name: 'home'
      },
      {
        path: 'replays',
        element: <Replay />,
        name: 'replays'
      },
      {
        path: 'settings/*',
        element: <SettingsView />,
        name: 'settings'
      }
    ]
  },
  {
    path: '/main/*',
    element: <Navigate replace to="/" />
  }
];

const App = () => {
  const routes = useRoutes(routesObj);

  const [themeMode, _] = useThemeMode();
  const theme = useMemo(() => createTheme(getThemeOptions(themeMode)), [themeMode]);

  const initialized = useAppStore((state) => state.initialized);

  // Then add the rest of the app listeners
  useAppListeners();

  if (!initialized) {
    return <LoadingView />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      {/* <ThemeProvider theme={theme as any}> */}
        <CssBaseline />
        {routes}
      {/* </ThemeProvider> */}
    </MuiThemeProvider>
  );
};

// Providers need to be initialized before the rest of the app can use them
const withProviders = (Component: React.ComponentType) => {
  return () => (
    <StyledEngineProvider injectFirst>
      {/* <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme as any}> */}
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ServiceProvider>
            <Router>
              <Component />
            </Router>
          </ServiceProvider>
        </ToastProvider>
      </QueryClientProvider>
      {/* </ThemeProvider>
      </MuiThemeProvider> */}
    </StyledEngineProvider>
  );
};

export default withProviders(App);
