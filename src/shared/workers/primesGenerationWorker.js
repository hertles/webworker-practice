import getPrimesUpTo from "../utils/getPrimesUpTo.js";

onmessage = (e) => {
  const generator = getPrimesUpTo(e.data);
  let next = generator.next();
  while (!next.done) {
    postMessage(next.value);
    next = generator.next();
  }
};
