import { useState } from "react";
import { Button, TextField, Modal, Box } from "@mui/material";

export default function ProductionGRN() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ingresar el codigo GRN
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            label="Ingrese el código GRN"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </Modal>
    </div>
  );
} 