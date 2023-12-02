package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
)

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func main() {
	var codes [1000]string
	days := map[string]string{
		"one":   "1",
		"two":   "2",
		"three": "3",
		"four":  "4",
		"five":  "5",
		"six":   "6",
		"seven": "7",
		"eight": "8",
		"nine":  "9",
	}
	var keys []string
	for key := range days {
		keys = append(keys, key)
	}
	regex, err := regexp.Compile("one|two|three|four|five|six|seven|eight|nine|\\d")
	revRegex, err := regexp.Compile("eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|\\d")
	if err != nil {
		log.Fatal(err)
	}
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	position := 0
	for scanner.Scan() {
		line := scanner.Text()
		match := regex.FindString(line)
		if match != "" {
			value, exists := days[match]
			if exists {
				codes[position] = value
			} else {
				codes[position] = match
			}
		}
		rMatch := revRegex.FindString(Reverse(line))
		if rMatch != "" {
			value, exists := days[Reverse(rMatch)]
			current := codes[position]
			if exists {
				codes[position] = current + value
			} else {
				codes[position] = current + rMatch
			}
		}
		position++
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	total := 0
	for _, str := range codes {
		num, err := strconv.Atoi(str)
		if err != nil {
			fmt.Printf("Error converting '%s' to an integer: %s\n", str, err)
			continue
		}
		total += num
	}
	fmt.Println(total)
}
