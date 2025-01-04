import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <Box sx={{ display: "flex" }}>
        <CircularProgress size={20}/>
      </Box>
    </div>
  );
}
