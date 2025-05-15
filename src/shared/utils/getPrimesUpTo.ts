export default function* getPrimesUpTo(limit: number) {
  if (limit < 2) return;

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      yield i;

      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }
}
