import getPrimesUpTo from "../utils/getPrimesUpTo.js";

onmessage = (e) => {
  const generator = getPrimesUpTo(e.data);

  let lastValue = null;

  for (const prime of generator) {
    lastValue = prime;
    postMessage({ done: false, value: prime });
  }

  postMessage({ done: true, value: lastValue });
};
