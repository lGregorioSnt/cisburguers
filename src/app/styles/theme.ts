"use client";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008037', // Seu verde
    },
    secondary: {
      main: '#6c757d', // Cinza neutro
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Cor principal do texto (preto)
      secondary: 'rgba(0, 0, 0, 0.6)', // Cor secundária (cinza)
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

export default theme;