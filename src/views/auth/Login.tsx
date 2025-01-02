import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";

function Login() {
  const { handleSubmit, control } = useForm();

  const onSubmit = () => {
    console.log('Inciando sesión...');
  };

  return (
    <div className="w-2/3 md:w-1/2 mx-auto">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "white",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <h2 className="text-center text-2xl font-bold mb-5">Iniciar Sesión</h2>
    
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Nombre de usuario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                    autoComplete="off"
                  />
                )}
                rules={{
                  required: "El nombre de usuario es obligatorio",
                  pattern: {
                    value: /^(?!.*\.\.)(?!.*\.$)(?!.*\._)(?!^_)(?!^\.)(?!.*_$)[a-zA-Z0-9._]{3,16}$/,
                    message: "Introduce un nombre de usuario válido",
                  },
                }}
              />
    
              {/* Contraseña */}
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
                rules={{ required: "La contraseña es obligatoria" }}
              />
    
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Iniciar Sesión
              </Button>
            </form>
          </Box>
        </Box>
    </div>
  );
}

export default Login;
