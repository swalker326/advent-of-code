import { readFileSync } from "fs";

const init = () => {
  const file = readFileSync("./source.txt", "utf8");
  const matrix = file.split("\n").map((line) => line.split(""));

  const getPartNumber = (y: number, x: number): string | null => {
    if (!isNaN(Number(matrix[y][x])) && matrix[y][x] !== ".") {
      let num = "";
      let originalX = x;
      while (
        x > 0 &&
        !isNaN(Number(matrix[y][x - 1])) &&
        matrix[y][x - 1] !== "."
      ) {
        x--;
      }
      while (
        x < matrix[y].length &&
        !isNaN(Number(matrix[y][x])) &&
        matrix[y][x] !== "."
      ) {
        num += matrix[y][x];
        x++;
      }
      if (x !== originalX) {
        return num;
      }
    }
    return null;
  };

  let gearRatios: Array<Array<string>> = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "*") {
        let adjacentPartNumbers: Set<string> = new Set();

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue; // Skip the gear itself

            const adjY = y + dy;
            const adjX = x + dx;

            if (
              adjY >= 0 &&
              adjY < matrix.length &&
              adjX >= 0 &&
              adjX < matrix[y].length
            ) {
              const partNumber = getPartNumber(adjY, adjX);
              if (partNumber) {
                adjacentPartNumbers.add(partNumber);
              }
            }
          }
        }

        // console.log(adjacentPartNumbers);
        if (adjacentPartNumbers.size === 2) {
          gearRatios.push(Array.from(adjacentPartNumbers));
        }
      }
    }
  }

  // Calculate the total gear ratio
  const totalGearRatio = gearRatios.reduce((total, nums) => {
    const [num1, num2] = nums;
    return total + parseInt(num1) * parseInt(num2);
  }, 0);

  console.log(`Total gear ratio: ${totalGearRatio}`);
};

init();
