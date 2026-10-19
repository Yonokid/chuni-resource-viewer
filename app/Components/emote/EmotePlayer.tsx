"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getBaseUrl } from "@/app/utils/global";
import { characterAspect, EmoteJson, EmoteRenderer, Timeline } from "./engine";

const FPS = 60; // timeline clock is in frames

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

export const useEmote = (chara: string) => {
  const [renderer, setRenderer] = useState<EmoteRenderer | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setRenderer(null);
    setError(false);
    (async () => {
      const json: EmoteJson = await fetch(getBaseUrl("chuni", `emotedata/${chara}.json`)).then((r) => r.json());
      const keys = Object.keys(json.source);
      const images = await Promise.all(keys.map((k) => loadImage(getBaseUrl("chuni", `emotedata/${json.source[k].texture.pixel}`))));
      if (!cancelled) setRenderer(new EmoteRenderer(json, Object.fromEntries(keys.map((k, i) => [k, images[i]]))));
    })().catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [chara]);
  return { renderer, error };
};

interface EmotePlayerProps {
  /** emotedata name (emotedata.json), e.g. uni, navi, exyear */
  chara: string;
  /** timeline labels (metadata.timelineControl[].label): body motion, then face/effect overlays */
  main?: string;
  diffs?: string[];
  height?: number;
}

/** Plays a main timeline (+ overlay timelines) of an E-mote character on a canvas. */
const EmotePlayer = ({ chara, main, diffs = [], height = 480 }: EmotePlayerProps) => {
  const { renderer, error } = useEmote(chara);
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = Math.round(height * Math.min(Math.max(renderer?.aspect() ?? 0.6, 0.6), 1.8));
  const diffKey = diffs.join("\n");

  useEffect(() => {
    const g = canvas.current?.getContext("2d");
    if (!renderer || !g) return;
    const byLabel = new Map<string, Timeline>(renderer.timelines().map((t) => [t.label, t]));
    const active = [main, ...diffKey.split("\n")].filter((l): l is string => !!l && byLabel.has(l)).map((l) => byLabel.get(l)!);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      renderer.draw(g, width, height, active, ((now - start) / 1000) * FPS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [renderer, main, diffKey, width, height]);

  if (error) return <Typography color="error">Failed to load {chara}</Typography>;
  return (
    <Box sx={{ lineHeight: 0, width, height, position: "relative" }}>
      {!renderer && <Typography sx={{ position: "absolute", p: 1 }}>Loading…</Typography>}
      <canvas ref={canvas} width={width} height={height} style={{ width, height }} />
    </Box>
  );
};

export default EmotePlayer;
