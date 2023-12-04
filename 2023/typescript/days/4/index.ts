import { readFileSync } from "fs";

type Game = {
  gameNumber: number;
  draws: number[];
  winningNumbers: number[];
};

const init = () => {
  const file = readFileSync("./source.txt", "utf8");
  const lines = file.split("\n");
  const games = [] as Game[];
  //Get the game draws and winning numbers
  for (let line of lines) {
    const lineSplit = line.split(":");
    const gameMeta = lineSplit[0];
    const gameNumber = gameMeta.match(/\d+/g);
    // const gameInfo =
    const [winningNumbers, draws] = lineSplit[1].split("|").reduce(
      (acc, current, index) => {
        switch (index) {
          case 0:
            acc[0] = current.split(" ").reduce((acc, current) => {
              if (current !== "" && current !== " ") {
                acc.push(parseInt(current));
              }
              return acc;
            }, [] as number[]);
            break;
          case 1:
            acc[1] = current.split(" ").reduce((acc, current) => {
              if (current !== "" && current !== " ") {
                acc.push(parseInt(current));
              }
              return acc;
            }, [] as number[]);
        }
        return acc;
      },
      [[], []] as [number[], number[]]
    );

    games.push({
      gameNumber: parseInt(gameNumber![0]),
      draws,
      winningNumbers
    });
  }
  let gameCount = 0;
  let checkgames = true;
  // games.forEach((g, i) => console.log(g.gameNumber, i));
  while (checkgames) {
    const gamesToCheck = games;
    for (let game of gamesToCheck) {
      let gamesToAdd = 0;
      const { draws, winningNumbers } = game;
      // console.log(draws, winningNumbers);
      draws.forEach((d) => {
        if (winningNumbers.includes(d)) {
          gameCount++;
          gamesToAdd++;
        }
      });
      // console.log(game);
      // console.log(`adding games for game ${game.gameNumber}: ${gamesToAdd} `);
      for (let i = 0; i < gamesToAdd; i++) {
        // console.log("adding game: ", game.gameNumber + (i + 1));
        const gameToAdd = games.find(
          (g) => g.gameNumber === game.gameNumber + (i + 1)
        );
        gamesToCheck.push(gameToAdd!);
      }
    }
    console.log("Done!");
    console.log(gamesToCheck.length);
    checkgames = false;
  }
};

init();
