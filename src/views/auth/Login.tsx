import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useAppStore } from "../../stores/useAppStore";
import { AuthUser } from "../../types";
import { useNavigate } from "react-router-dom";
import Error from "../../components/Error";
import Spinner from "../../components/Spinner";
import { useEffect } from "react";

function Login() {
  const { handleSubmit, control } = useForm<AuthUser>();
  const login = useAppStore((state) => state.login);
  const loadingAuth = useAppStore((state) => state.loadingAuth);
  const logedIn = useAppStore((state) => state.logedIn);
  const errors = useAppStore((state) => state.Autherrors);
  const navigate = useNavigate();

  useEffect(()=>{
    if(logedIn){
      navigate('/dashboard');
    }
  },[])
  const createUser = async (data: AuthUser) => {
    await login(data).then(() => {
      navigate("/dashboard");
      window.location.reload();
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "white",
        padding: 4,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-5">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleSubmit(createUser)}>
        {errors &&
          errors.map((error, index) => <Error key={index}>{error}</Error>)}

        {/* Nombre de Usuario */}
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
              value:
                /^(?!.*\.\.)(?!.*\.$)(?!.*\._)(?!^_)(?!^\.)(?!.*_$)[a-zA-Z0-9._]{3,16}$/,
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

        {/* Botón de Inicio de Sesión */}
        <Button
          disabled={loadingAuth}
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: "#1976D2",
            color: "white",
            "&:hover": { backgroundColor: "#1565C0" },
          }}
        >
          {loadingAuth ? <Spinner /> : "Iniciar Sesión"}
        </Button>
      </form>
    </Box>
  );
}

export default Login;
