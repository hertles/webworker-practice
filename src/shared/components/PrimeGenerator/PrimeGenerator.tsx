import { Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { type FormEventHandler, useEffect, useMemo, useState } from "react";

const primesGenerationWorker = new Worker(
  "src/shared/workers/primesGenerationWorker.js",
  { type: "module" },
);

export default function PrimeGenerator() {
  const [limitStr, setLimitStr] = useState("");
  const [prime, setPrime] = useState<number | null>(null);

  const isTypeError = useMemo(() => Number.isNaN(Number(limitStr)), [limitStr]);

  const generatePrimes: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    primesGenerationWorker.postMessage(Number(limitStr));
  };

  const handleGenerate = (event: MessageEvent<number>) => {
    event.preventDefault();
    setPrime(event.data);
  };

  useEffect(() => {
    primesGenerationWorker.addEventListener("message", handleGenerate);
    return () =>
      primesGenerationWorker.removeEventListener("message", handleGenerate);
  }, []);

  return (
    <form onSubmit={generatePrimes}>
      <Stack gap={2}>
        <Typography variant="h6">Найти Самое Большое Простое Число</Typography>
        <TextField
          value={limitStr}
          onChange={(event) => setLimitStr(event.target.value)}
          type="number"
          label="До какого числа считать"
          error={isTypeError}
          helperText={isTypeError ? "Введите число" : null}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isTypeError || !limitStr}
        >
          Рассчитать
        </Button>
        {prime !== null && <Chip key={prime} label={prime} />}
      </Stack>
    </form>
  );
}
