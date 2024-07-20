import { Backdrop, CircularProgress } from "@mui/material";
import { useLoader } from "../contexts/LoaderProvider";

export const GlobalLoader: React.FC = () => {
    const { loading } = useLoader();
  
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', backgroundColor:"rgba(0,0,0,0.1)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
  };