import {
  Button,
  Chip,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  type FormEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import throttle from "../../utils/throttle.ts";

export default function PrimeGenerator() {
  const [limitStr, setLimitStr] = useState("");
  const [prime, setPrime] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const handleLimitInputChange = (nextLimitStr: string) => {
    if (nextLimitStr.length <= 8) {
      setLimitStr(nextLimitStr);
    }
  };

  const createWorker = () => {
    const worker = new Worker("src/shared/workers/primesGenerationWorker.js", {
      type: "module",
    });
    worker.addEventListener("message", handleGenerate);
    workerRef.current = worker;
  };

  const generatePrimes: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    createWorker();
    setIsGenerating(true);
    workerRef.current?.postMessage(Number(limitStr));
  };

  const handleGenerate = useMemo(
    () =>
      throttle((event: MessageEvent<IteratorYieldResult<number>>) => {
        const { value, done } = event.data;
        if (value) {
          setPrime(value);
        }
        setIsGenerating(!done);
        setIsDone(Boolean(done));
      }, 500),
    [],
  );

  const handleInterrupt = () => {
    setIsGenerating(false);
    workerRef.current?.terminate();
  };

  useEffect(() => {
    return () =>
      workerRef.current?.removeEventListener("message", handleGenerate);
  }, []);

  return (
    <form onSubmit={generatePrimes}>
      <Stack gap={2}>
        <Typography variant="h6">Найти Самое Большое Простое Число</Typography>
        <TextField
          value={limitStr}
          onChange={(event) => handleLimitInputChange(event.target.value)}
          type="number"
          label="До какого числа считать"
          disabled={isGenerating}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!limitStr || isGenerating}
        >
          Рассчитать
        </Button>
        <Chip label={prime ?? "---"} color={isDone ? "success" : undefined} />
        {isGenerating && prime && (
          <LinearProgress
            variant="determinate"
            value={(prime / Number(limitStr)) * 100}
          />
        )}
        {isGenerating && (
          <Button onClick={handleInterrupt} variant="contained">
            Прервать
          </Button>
        )}
      </Stack>
    </form>
  );
}
