import { readFileSync } from "fs";

const totalCubes = {
  red: 12,
  green: 13,
  blue: 14
};

const init = () => {
  const file = readFileSync("./source.txt", "utf8");
  const lines = file.split("\n");
  const allgames: number[] = [];

  let position = 0;
  for (let line of lines) {
    const split = line.split(":");
    const gameDetails = split[0];
    const games = split[1];
    const matches = games.split(";");
    const highest = {
      red: 0,
      green: 0,
      blue: 0
    };
    for (let match of matches) {
      const redMatch = match.match(/([0-9]+) red/);
      const greenMatch = match.match(/([0-9]+) green/);
      const blueMatch = match.match(/([0-9]+) blue/);
      if (redMatch) {
        if (parseInt(redMatch[1]) > highest.red) {
          highest.red = parseInt(redMatch[1]);
        }
      }
      if (greenMatch) {
        if (parseInt(greenMatch[1]) > highest.green) {
          highest.green = parseInt(greenMatch[1]);
        }
      }
      if (blueMatch) {
        if (parseInt(blueMatch[1]) > highest.blue) {
          highest.blue = parseInt(blueMatch[1]);
        }
      }
    }
    allgames.push(highest.red * highest.green * highest.blue);
    position++;
  }
  const totalPower = allgames.reduce((acc, game) => {
    if (game > 0) {
      return acc + game;
    }
    return acc;
  }, 0);
  console.log(totalPower);
};

init();
