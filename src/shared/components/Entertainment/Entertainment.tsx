import {
  Button,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CanvasDrawer from "./components/CanvasDrawer/CanvasDrawer.tsx";
import MusicPlayer from "../MusicPlayer/MusicPlayer.tsx";

export default function Entertainment() {
  const [isShowSnackbar, setIsShowSnackbar] = useState(false);

  return (
    <>
      <Snackbar open={isShowSnackbar} onClose={() => setIsShowSnackbar(false)}>
        <Paper elevation={4} sx={{ p: 2 }}>
          <Typography>Фокус!</Typography>
        </Paper>
      </Snackbar>
      <Stack gap={2}>
        <Typography variant="h6">Развлечение</Typography>
        <MusicPlayer
          src="src/assets/music/СБПЧ - Злой.mp3"
          title="Злой"
          artist="Самое Большое Простое Число"
        />
        <TextField label="Расскажите, как дела" />
        <Button onClick={() => setIsShowSnackbar(true)} variant="contained">
          Показать фокус
        </Button>
        <CanvasDrawer />
      </Stack>
    </>
  );
}
