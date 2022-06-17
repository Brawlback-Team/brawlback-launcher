import "./styles/styles.scss";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter as Router, Navigate, useRoutes } from "react-router-dom";

import { useAppStore } from "@/lib/hooks/useApp";

import { ToastProvider } from "./components/ToastProvider";
import { useAppListeners } from "./lib/hooks/useAppListeners";
import { useThemeMode } from "./lib/hooks/useSettings";
import { AppBase, HomePage, SettingsPage } from "./pages";
import { ServiceProvider } from "./services";
import getThemeOptions from "./styles/theme";
import { LoadingView } from "./views/LoadingView";

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

function Replay() {
  return <h3>Replay</h3>;
}

const routesObj = [
  {
    path: "/",
    element: <AppBase />,
    name: "base",
    children: [
      {
        index: true,
        element: <HomePage />,
        name: "home",
      },
      {
        path: "replays/*",
        element: <Replay />,
        name: "replays",
      },
      {
        path: "settings/*",
        element: <SettingsPage />,
        name: "settings",
      },
    ],
  },
  {
    path: "/main/*",
    element: <Navigate replace to="/" />,
  },
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
      <CssBaseline />
      {routes}
    </MuiThemeProvider>
  );
};

// Providers need to be initialized before the rest of the app can use them
const withProviders = (Component: React.ComponentType) => {
  return () => (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ServiceProvider>
            <Router>
              <Component />
            </Router>
          </ServiceProvider>
        </ToastProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
};

export default withProviders(App);
