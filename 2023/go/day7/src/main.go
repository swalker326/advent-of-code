package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Hand struct {
	cards    []Card
	original []Card
	bet      int
	handType int
}
type Card struct {
	card int
}

var CardValues = map[string]int{
	"A": 14,
	"K": 13,
	"Q": 12,
	"J": 11,
	"T": 10,
	"9": 9,
	"8": 8,
	"7": 7,
	"6": 6,
	"5": 5,
	"4": 4,
	"3": 3,
	"2": 2,
}

const (
	HighCard = iota
	OnePair
	TwoPair
	ThreeOfAKind
	FullHouse
	FourOfAKind
	FiveOfAKind
)

var hands []Hand

func main() {
	file, err := os.Open("./src/input.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.Split(line, " ")
		var cards []Card
		for _, part := range parts[0] {
			str := string(part)
			cards = append(cards, Card{CardValues[str]})
		}
		originalCards := make([]Card, len(cards))
		copy(originalCards, cards)
		sort.Slice(cards, func(i, j int) bool {
			return cards[i].card > cards[j].card
		})
		bet, err := strconv.Atoi(parts[1])
		if err != nil {
			log.Fatal(err)
		}
		hands = append(hands, Hand{cards, originalCards, bet, -1})
	}
	for i, hand := range hands {
		handType := EvaluateHand(hand)
		hands[i].handType = handType
	}
	sort.Slice(hands, func(i, j int) bool {
		if hands[i].handType != hands[j].handType {
			return hands[i].handType > hands[j].handType
		} else {
			// Tie-breaking for hands with the same type
			for k := 0; k < len(hands[i].original); k++ {
				if hands[i].original[k].card != hands[j].original[k].card {
					return hands[i].original[k].card > hands[j].original[k].card
				}
			}
		}
		return false // If all cards are equal in the original order
	})
	totalWinnings := 0
	for index, hand := range ReverseHands(hands) {
		totalWinnings += hand.bet * (index + 1)
	}
	fmt.Println(totalWinnings)
}

func ReverseHands(hands []Hand) []Hand {
	newHands := make([]Hand, len(hands))
	for i, hand := range hands {
		newHands[len(hands)-1-i] = hand
	}
	return newHands
}

func EvaluateHand(hand Hand) int {
	if len(hand.cards) != 5 {
		return -1 // Invalid hand size
	}

	valueCounts := make(map[int]int)
	for _, card := range hand.cards {
		valueCounts[card.card]++
	}

	var pairs, threes, fours int
	for _, count := range valueCounts {
		if count == 2 {
			pairs++
		} else if count == 3 {
			threes++
		} else if count == 4 {
			fours++
		}
	}

	switch {
	case len(valueCounts) == 1:
		return FiveOfAKind
	case fours == 1:
		return FourOfAKind
	case threes == 1 && pairs == 1:
		return FullHouse
	case threes == 1:
		return ThreeOfAKind
	case pairs == 2:
		return TwoPair
	case pairs == 1:
		return OnePair
	default:
		return HighCard
	}
}
