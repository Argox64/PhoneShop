import "./App.css";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import AppRoutes from "./Routes";
import { SessionProvider } from "./components/contexts/AuthProvider";
import { GlobalLoader } from "./components/main/GlobalLoader";
import { LoaderProvider } from "./components/contexts/LoaderProvider";
import { EventProvider } from "./components/contexts/EventContext";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark' selon le besoin
    primary: {
      main: '#1E212B',
      light: '#383B46',
      dark: '#0B0E18',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#F9F9F9',
      dark: '#E2E2E2',
      contrastText: '#1C1B1B',
    },
    error: {
      main: '#BA1A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FCF8F9',
      paper: '#F6F3F2',
    },
    text: {
      primary: '#1C1B1C',
      secondary: '#5D5F5F',
    }
  },
});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <LoaderProvider>
              <SessionProvider>
                <EventProvider>
                  <Box sx={{ paddingTop: '64px' }}>
                    <GlobalLoader />
                    <AppRoutes />
                  </Box>
                </EventProvider>
              </SessionProvider>
            </LoaderProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
