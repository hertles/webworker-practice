import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface MusicPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

export default function MusicPlayer(props: MusicPlayerProps) {
  const { src, title, artist } = props;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio || typeof newValue !== "number") return;
    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Box p={2} borderRadius={2} boxShadow={2} width="100%" maxWidth={400}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <Stack spacing={2}>
        <Typography variant="h6">{title || "Без названия"}</Typography>
        {artist && <Typography variant="subtitle2">{artist}</Typography>}

        <Slider
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">{formatTime(currentTime)}</Typography>
          <Typography variant="body2">{formatTime(duration)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="center">
          <IconButton onClick={togglePlay} size="large">
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
