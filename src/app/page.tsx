"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Box, Typography, TextField, Button } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const API_URL = "http://localhost:3001/usuarios/login";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao tentar fazer login.");
        return;
      }

      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        router.push("/dashboarduser");
      } else {
        setErro("Resposta inesperada do servidor após o login.");
      }

    } catch (err) {
      setErro("Não foi possível conectar ao servidor.");
    }
  };

  const logoWidth = 280;
  const logoHeight = 115;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        backgroundImage: 'url(/images/bg-petrobras.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 3,
          zIndex: 2,
          position: 'relative',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Image
          src="/images/logo-petrobras.png"
          alt="Logo Petrobras"
          width={logoWidth}
          height={logoHeight}
          priority
          style={{ 
            filter: "brightness(1.5)",
            objectFit: "contain"
          }}
        />

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            p: { xs: 3, sm: 5 },
            borderRadius: '16px',
            boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.7)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ 
            mb: 1, 
            color: 'white', 
            textAlign: 'left',
            width: '100%'
          }}>
            Bem-Vindo
          </Typography>

          <Typography variant="subtitle1" sx={{ color: '#bbb' }}>
            E-mail
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '& input': { color: 'white' },
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#E040FB' },
              },
            }}
          />

          <Typography variant="subtitle1" sx={{ mt: 1, color: '#bbb' }}>
            Senha
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '& input': { color: 'white' },
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#E040FB' },
              },
            }}
          />

          {erro && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 1, textAlign: 'center', color: '#ffcdd2' }}
            >
              {erro}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              p: 1.5,
              fontWeight: 'bold',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #008037 30%, #00642c 90%)',
              boxShadow: '0 3px 5px 2px rgba(0, 128, 55, .3)',
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #00642c 30%, #008037 90%)',
                boxShadow: '0 3px 5px 2px rgba(0, 128, 55, .5)',
              },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}