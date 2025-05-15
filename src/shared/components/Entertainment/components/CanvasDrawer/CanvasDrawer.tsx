import React, { useRef, useEffect, useState } from "react";
import { Button, Paper, Stack } from "@mui/material";

const CanvasDrawer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = 400; // фиксированная высота, можно сделать тоже адаптивной

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(dpr, dpr);
      context.lineCap = "round";
      context.lineWidth = 2;
      context.strokeStyle = "#000";
      setCtx(context);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    const { width, height } = canvasRef.current;
    ctx.clearRect(0, 0, width, height);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            border: "1px solid black",
            cursor: "crosshair",
          }}
          width="100%"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
        <Button onClick={clearCanvas}>Очистить</Button>
      </Stack>
    </Paper>
  );
};

export default CanvasDrawer;
