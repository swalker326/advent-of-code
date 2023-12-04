import { readFileSync } from "fs";

const init = () => {
  const file = readFileSync("./source.txt", "utf8");
  const winningTotal = file.split("\n").reduce((total, line) => {
    const split = line.split(":");
    const gameInfo = split[0].split(" ");
    let [_, cardNumber] = gameInfo;
    const [winning, draw] = split[1].split("|");
    // console.log(winning, draw);
    const drawnNumbers = draw
      .split(" ")
      .map((num) => Number(num.trim()))
      .filter((num) => num !== 0);

    const winningNumbers = winning
      .split(" ")
      .map((num) => Number(num.trim()))
      .filter((num) => num !== 0);

    function calculateWinners(
      drawnNumbers: number[],
      winningNumbers: number[]
    ) {
      // Filter out the winning numbers
      const winners = drawnNumbers.filter((num) =>
        winningNumbers.includes(num)
      );

      const total = winners.length > 0 ? Math.pow(2, winners.length - 1) : 0;

      return { total, winners };
    }
    const drawWinners = calculateWinners(drawnNumbers, winningNumbers);
    console.log(cardNumber, drawWinners);
    return drawWinners.total + total;
  }, 0);
  console.log(winningTotal);
};

init();
