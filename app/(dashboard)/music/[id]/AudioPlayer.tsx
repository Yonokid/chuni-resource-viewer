//All credits go to DNARoma and the contributors at
//https://github.com/Sekai-World/sekai-viewer/blob/dev/src/pages/music/MusicDetail.tsx
//Thank you
//I have updated this version to use Grid2
import {
  Container,
  Grid2,
  IconButton,
  Link,
  Paper,
  Slider,
  Tooltip,
} from "@mui/material";
import {
  CloudDownload,
  Pause,
  PlayArrow,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { Howl } from "howler";
import React, { useCallback, useEffect, useState } from "react";

const AudioPlayer: React.FC<{
  src: string;
  onPlay?: (howl: Howl) => void;
  onLoad?: (howl: Howl) => void;
  onSave?: (src: string) => void;
  style?: React.CSSProperties;
  offset?: number;
}> = ({ src, onPlay, onLoad, onSave, style, offset }) => {
  const [sound, setSound] = useState<Howl>();
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(100);
  const [totalOffset, setTotalOffset] = useState(offset || 0);

  useEffect(() => {
    const _sound = new Howl({
      src: [src],
      html5: true,
      format: ["mp3"],
      volume: volume / 100,
    });
    _sound.on("load", () => {
      setTotalTime(_sound.duration() - totalOffset);
      setPlaybackTime(0);
      _sound.seek(totalOffset);
      if (onLoad) onLoad(_sound);
    });
    _sound.on("play", () => {
      if (onPlay) onPlay(_sound);
      requestAnimationFrame(function update() {
        if (!_sound.playing()) return;
        const currentTime = _sound.seek() as number;
        setPlaybackTime(currentTime - totalOffset);

        requestAnimationFrame(update);
      });
    });
    _sound.on("stop", () => {
      setPlaybackTime(0);
      _sound.seek(totalOffset);
      setIsPlay(false);
    });
    _sound.on("end", () => {
      setPlaybackTime(0);
      _sound.seek(totalOffset);
      setIsPlay(false);
    });
    setSound(_sound);
    return () => {
      _sound.stop();
      _sound.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad, onPlay, src, totalOffset]);

  useEffect(() => {
    if (offset !== undefined) setTotalOffset(offset);
  }, [offset]);

  const seekHandler = useCallback(
    (_: any, v: number | number[]) => {
      if (sound) {
        setPlaybackTime(v as number);
        if (sound.playing()) {
          sound.pause();
          sound.seek(totalOffset + (v as number));
          sound.play();
        } else {
          sound.seek(totalOffset + (v as number));
        }
      }
    },
    [sound, totalOffset],
  );

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time - minutes * 60) || 0;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }, []);

  return (
    <Paper>
      <Container>
        <Grid2 container justifyContent="space-between" alignItems="center">
          <Grid2 size={{ xs: 2, md: 1 }}>{formatTime(playbackTime)}</Grid2>
          <Grid2 size={{ xs: 7, md: 9 }}>
            <Slider
              value={playbackTime}
              onChange={seekHandler}
              min={0}
              max={totalTime}
              step={0.1}
            />
          </Grid2>
          <Grid2 size={{ xs: 2, md: 1 }}>{formatTime(totalTime)}</Grid2>
        </Grid2>
        <Grid2 container justifyContent="space-between" alignItems="center">
          <Grid2 size={{ xs: 2, md: 1 }}>
            <Tooltip title="Download">
              <IconButton
                onClick={() => {
                  if (onSave) onSave(src);
                }}
                size="large"
              >
                {!onSave ? (
                  <Link href={src} download underline="hover">
                    <CloudDownload />
                  </Link>
                ) : (
                  <CloudDownload />
                )}
              </IconButton>
            </Tooltip>
          </Grid2>
          <Grid2 size={{ xs: 2, md: 1 }}>
            <IconButton
              onClick={() => {
                setIsPlay(!isPlay);
                if (!isPlay) sound?.play();
                else sound?.pause();
              }}
              size="large"
            >
              {isPlay ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Grid2>
          <Grid2
            size={{ xs: 4, md: 3 }}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid2 size={{ xs: 2 }}>
              <IconButton
                onClick={() => {
                  setIsMute(!isMute);
                  sound?.mute(!isMute);
                }}
                size="large"
              >
                {isMute ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Grid2>
            <Grid2 size={{ xs: 7, md: 8 }}>
              <Slider
                value={volume}
                onChange={(_, v) => {
                  setVolume(v as number);
                  sound?.volume((v as number) / 100);
                }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Paper>
  );
};

export default AudioPlayer;
