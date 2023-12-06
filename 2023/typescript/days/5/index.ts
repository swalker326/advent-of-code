import { readFileSync } from "fs";
/*
seeds: 79, 14, 55, 13

seed-to-soil map: 
Any source numbers that aren't mapped correspond to the same destination number. So, seed number 10 corresponds to soil number 10.
50 98 2   destinationStart: 50, sourceStart: 98, length: 2    destinationRange: 50-51, sourceRange: 98-99
52 50 48  destinationStart: 52, sourceStart: 50, length: 48   destinationRange: 52-99, sourceRange: 50-97
*/
const sample = {
  dStart: 50,
  sStart: 98,
  rangeLength: 2
};
type Mapping = {
  dStart: number;
  sStart: number;
  rangeLength: number;
};
//I now need a function that takes in a seed number, and will assocaite the seed number with the equlivent mapping number.
//so in each map, there is a dStart this is the destination start(seed), and the sStart is the source start(soil)
//so if I have a seed number, I need to find the mapping that has the dStart that is the same index as the seed number,
// the final number tells me how many numbers to add to each dStart and sStart to get the final range.
// for example taking in seed number
const findMapping = (numberToMap: number, mapKey: string) => {
  const map = mapKeys[mapKey];
  for (const mapping of map) {
    if (
      numberToMap >= mapping.sStart &&
      numberToMap <= mapping.sStart + mapping.rangeLength
    ) {
      const destinationRange = Array.from(
        { length: mapping.rangeLength },
        (_, i) => i + mapping.dStart
      );

      const sourceRange = Array.from(
        { length: mapping.rangeLength },
        (_, i) => i + mapping.sStart
      );

      const index = sourceRange.indexOf(numberToMap);
      console.log("index: ", index);
      return destinationRange[index];
    }
  }
  return numberToMap;
};
const mapKeys: Record<string, Mapping[]> = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": []
};
function getSeedToSoilMap(seedNumber: number) {
  return findMapping(seedNumber, "seed-to-soil");
}
function getSoilToFertilizerMap(soilNumber: number) {
  console.log("soilNumber: ", soilNumber);
  return findMapping(soilNumber, "soil-to-fertilizer");
}
function getFertilizerToWaterMap(fertilizerNumber: number) {
  console.log("fertilizerNumber: ", fertilizerNumber);
  return findMapping(fertilizerNumber, "fertilizer-to-water");
}
function getWaterToLightMap(waterNumber: number) {
  return findMapping(waterNumber, "water-to-light");
}
function getLightToTemperatureMap(lightNumber: number) {
  return findMapping(lightNumber, "light-to-temperature");
}
function getTemperatureToHumidityMap(temperatureNumber: number) {
  return findMapping(temperatureNumber, "temperature-to-humidity");
}
function getHumidityToLocationMap(humidityNumber: number) {
  return findMapping(humidityNumber, "humidity-to-location");
}

function gatherMapInfo(lines: string[], mapKey: string) {
  let collectInfo = false;
  for (const line of lines) {
    if (line.startsWith(`${mapKey} map:`)) {
      collectInfo = true;
      continue;
    }
    if (collectInfo) {
      if (line.startsWith(`${mapKey}`)) {
        continue;
      }
      if (line === "") {
        collectInfo = false;
        continue;
      }
      const stringSplit = line.split(" ");
      const [dStart, sStart, rangeLength] = stringSplit;
      const mapObject = {
        dStart: parseInt(dStart),
        sStart: parseInt(sStart),
        rangeLength: parseInt(rangeLength)
      };

      mapKeys[mapKey].push(mapObject);
    }
  }
}

const init = () => {
  let seeds: number[] = [];
  const file = readFileSync("./test.txt", "utf8");
  const lines = file.split("\n");
  let collectSoilInfo = false;
  const mapRegex = /((\w+)-to-(\w+))/;
  for (const line of lines) {
    if (line.startsWith("seeds: ")) {
      seeds = line
        .split(": ")[1]
        .split(" ")
        .map((seed) => parseInt(seed));
    }

    if (mapRegex.test(line)) {
      const match = line.match(mapRegex);
      if (!match) {
        continue;
      }
      const mapKey = match[1];
      gatherMapInfo(lines, mapKey);
    }
  }
  const locations = [];
  // seeds now come in pairs, the first seed is the starting point and the second seed is the range.
  // so I need to add a seed for each number in the range starting from the starting point.
  // so seed 1 2, means I need seeds 1, 2, 3
  // seeds 10 5, means I need seeds 10, 11, 12, 13, 14, 15
  // seeds 10 1, means I need seed 10, 11
  //group the seeds into pairs first
  const newSeeds = seeds.reduce((acc, seed, index) => {
    if (index % 2 === 0) {
      const newSeeds = Array.from({ length: seeds[index + 1] }, (_, i) => {
        return i + seed;
      });
      acc.push(...newSeeds);
    }
    return acc;
  }, [] as number[]);
  console.log("newSeeds: ", newSeeds, newSeeds.length);
  for (const seed of seeds) {
    console.log("seed: ", seed);
    const soil = getSeedToSoilMap(seed);
    const fertilizer = getSoilToFertilizerMap(soil);
    const water = getFertilizerToWaterMap(fertilizer);
    const light = getWaterToLightMap(water);
    const temperature = getLightToTemperatureMap(light);
    const humidity = getTemperatureToHumidityMap(temperature);
    const location = getHumidityToLocationMap(humidity);
    locations.push(location);
  }
  console.log(locations);
};

init();
