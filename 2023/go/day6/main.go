package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type Race struct {
	time     int
	distance int
}

func main() {
	// file, err := os.Open("./test.txt")
	file, err := os.Open("./input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	pattern := "\\d+"
	re := regexp.MustCompile(pattern)
	//initialise a map called times
	//I write javascript, so used to using objects, I need an array of objects like this: {time: number, distance: number}
	var races []Race

	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "Time: ") {
			matches := re.FindAllString(line, -1)
			time := ""
			for _, match := range matches {
				time += match
			}
			number, err := strconv.Atoi(time)
			if err != nil {
				log.Fatal(err)
			}
			races = append(races, Race{time: number, distance: 0})
		}
		if strings.HasPrefix(line, "Distance: ") {
			matches := re.FindAllString(line, -1)
			time := ""
			for _, match := range matches {
				time += match
			}
			number, err := strconv.Atoi(time)
			if err != nil {
				log.Fatal(err)
			}
			races[0].distance = number
		}
	}
	// times := [][]int{}
	margin := 1
	for _, race := range races {
		times := getWinningRaceTimes(race)
		margin = margin * len(times)
	}
	fmt.Println(margin)

}

func getWinningRaceTimes(race Race) []int {
	//maths ugh
	//for each ms a button is held, a boat builds up 1mm per ms in speed
	//so if a boat is held for 10ms, it will be traveling at 10mm/ms
	//I know the distance, so I need to find all the numbers that would accomplish that distance
	// if the race is 7ms long and the needed distance is 9ms
	// (1*1) = 1mm per ms = distance in 8ms @ 1mm per ms = 8mm
	// (2*1) = 2mm per ms = distance in 7ms @ 2mm per ms = 14mm
	// (3*1) = 3mm per ms = distance in 6ms @ 3mm per ms = 18mm
	// if the race details are: 7ms run time and 9mm distance
	// then the valid hold times are 2, 3, 4, or 5 ms

	validHoldTimes := []int{}
	for i := 1; i < race.time; i++ {
		speed := i
		totalTime := race.time - i
		distance := speed * totalTime
		if distance > race.distance {
			validHoldTimes = append(validHoldTimes, i)
		}

	}
	return validHoldTimes

}
