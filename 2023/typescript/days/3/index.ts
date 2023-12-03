import { readFileSync } from "fs";

const init = () => {
  // const file = readFileSync("./source.txt", "utf8");
  const file = readFileSync("./text.txt", "utf8");
  const lines = file.split("\n");
  let position = 0;

  for (let line of lines) {
    // const firstNumberMatch = line.match(numberRegex);
    // const reversed = line.split("").reverse().join("");
    // const secondNumberMatch = reversed.match(numberRegexReversed);
    // console.log(firstNumberMatch);
    // const firstNumber =
    //   firstNumberMatch[0]?.length === 1
    //     ? firstNumberMatch[0]
    //     : numberWords[firstNumberMatch[0]];
    // const secondNumber =
    //   secondNumberMatch[0].length === 1
    //     ? secondNumberMatch[0]
    //     : numberWords[secondNumberMatch[0].split("").reverse().join("")];
    // codes[position] = firstNumber + secondNumber;
    // console.log(position, codes[position], line);
    position++;
  }
  // const codesTotal = codes.reduce((acc, code) => {
  //   return acc + parseInt(code);
  // }, 0);
  // console.log(codesTotal);
};

init();
