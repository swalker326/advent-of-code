import { readFileSync } from "fs";

const numberWords = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9"
};
const numberWordsRegex = Object.keys(numberWords).join("|");
const reversedNumberWords = Object.keys(numberWords)
  .map((k) => k.split("").reverse().join(""))
  .join("|");
const numberRegex = new RegExp(`${numberWordsRegex}|\\d`);
const numberRegexReversed = new RegExp(`${reversedNumberWords}|\\d`);

console.log(numberRegexReversed);

const init = () => {
  const file = readFileSync("./source.txt", "utf8");
  const lines = file.split("\n");
  const codes: string[] = [""];
  let position = 0;

  for (let line of lines) {
    const firstNumberMatch = line.match(numberRegex);
    const reversed = line.split("").reverse().join("");
    const secondNumberMatch = reversed.match(numberRegexReversed);
    console.log(firstNumberMatch);
    const firstNumber =
      firstNumberMatch[0]?.length === 1
        ? firstNumberMatch[0]
        : numberWords[firstNumberMatch[0]];
    const secondNumber =
      secondNumberMatch[0].length === 1
        ? secondNumberMatch[0]
        : numberWords[secondNumberMatch[0].split("").reverse().join("")];
    codes[position] = firstNumber + secondNumber;
    console.log(position, codes[position], line);
    position++;
  }
  const codesTotal = codes.reduce((acc, code) => {
    return acc + parseInt(code);
  }, 0);
  console.log(codesTotal);
};

init();
