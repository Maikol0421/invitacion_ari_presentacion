import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./App.css";

const MySwal = withReactContent(Swal);

function App() {
  const [numAdults, setNumAdults] = useState("");
  const [numChildren, setNumChildren] = useState("");
  const [adultNames, setAdultNames] = useState([]);
  const [childNames, setChildNames] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleAdultsChange = (event) => {
    const value = event.target.value;
    setNumAdults(value);
    const newAdultNames = Array.from(
      { length: value },
      (_, i) => adultNames[i] || ""
    );
    setAdultNames(newAdultNames);
  };

  const handleChildChange = (event) => {
    const value = event.target.value;
    setNumChildren(value);
    const newChildNames = Array.from(
      { length: value },
      (_, i) => childNames[i] || ""
    );
    setChildNames(newChildNames);
  };

  const handleAdultNameChange = (index, value) => {
    const updated = [...adultNames];
    updated[index] = value;
    setAdultNames(updated);
  };

  const handleChildNameChange = (index, value) => {
    const updated = [...childNames];
    updated[index] = value;
    setChildNames(updated);
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (numAdults === "") {
      MySwal.fire(
        "Lo sentimos..",
        "Por favor seleccione una cantidad de adultos",
        "error"
      );
      return;
    }
    // Validaciones: todos los campos de adultos deben estar completos
    if (adultNames.some((name) => name.trim() === "")) {
      MySwal.fire(
        "Lo sentimos..",
        "Por favor complete todos los nombres de adultos",
        "error"
      );
      return;
    }
    // Si se seleccionó cantidad de niñ@s, se validan los campos
    if (numChildren === "") {
      MySwal.fire(
        "Lo sentimos..",
        "Por favor seleccione una cantidad de niñ@s",
        "error"
      );
      return;
    } else {
      if (numChildren !== "" && childNames.some((name) => name.trim() === "")) {
        MySwal.fire(
          "Lo sentimos..",
          "Por favor complete todos los nombres de niñ@s",
          "error"
        );
        return;
      }
    }

    const data = {
      numAdults,
      adultNames,
      numChildren: numChildren || 0,
      childNames,
    };

    try {
      const response = await fetch('https://controlgastosbackend-production.up.railway.app/api/invitation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      await response.json();
      console.log(response.status)
      MySwal.fire('Confirmado', 'Espera tus boletos para vivir esta aventura congelada pronto!!!', 'success');
      console.log("Datos enviados:", data);
    } catch (error) {
      console.error(error);
      MySwal.fire('Error', 'Hubo un problema al enviar la información', 'error');
    }
  };

  return (
    <Box className="background">
      <Container
        sx={{
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 2,
          boxShadow: 3,
          // Estilos responsivos para adaptarse tanto a móvil como a PC
          // width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
          width: "90%",
          margin: "auto",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#005aa3" }}
        >
          Mis 3 años Emily Ariade
        </Typography>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ color: "#005aa3" }}
        >
          Favor de completar los campos para tu confirmación
        </Typography>

        <TextField
          select
          label="Número de Adultos"
          value={numAdults}
          onChange={handleAdultsChange}
          fullWidth
          margin="normal"
        >
          {[1, 2, 3, 4, 5, 6].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {adultNames.map((name, index) => (
          <TextField
            key={index}
            label={`Invitado ${index + 1}`}
            value={name}
            onChange={(e) => handleAdultNameChange(index, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            error={submitAttempted && name.trim() === ""}
            helperText={
              submitAttempted && name.trim() === "" ? "Campo requerido" : ""
            }
          />
        ))}

        <TextField
          select
          label="Cantidad de niñ@s"
          value={numChildren}
          onChange={handleChildChange}
          fullWidth
          margin="normal"
        >
          {[0, 1, 2, 3, 4].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {childNames.map((name, index) => (
          <TextField
            key={index}
            label={`Menor ${index + 1}`}
            value={name}
            onChange={(e) => handleChildNameChange(index, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            error={submitAttempted && name.trim() === ""}
            helperText={
              submitAttempted && name.trim() === "" ? "Campo requerido" : ""
            }
          />
        ))}

        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleSubmit}
        >
          Confirmar Asistencia
        </Button>
      </Container>
    </Box>
  );
}

export default App;
