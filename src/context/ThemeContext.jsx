/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('notepad-theme');
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('notepad-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#007acc',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1e1e1e',
                  secondary: '#666',
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#007acc',
                },
                background: {
                  default: '#1e1e1e',
                  paper: '#2d2d2d',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#999',
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
