package game;

import java.util.Collections;
import java.util.Vector;

public class CardDeck {
	private Vector<String> deck;
	private int position;
	
	public CardDeck() {//Constructor
		int position = 0;
		String[] cards = {
				"2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS",
				"2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC",
				"2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH",
				"2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD"};
		deck = new Vector<String>();
		Collections.addAll(deck, cards);
		Collections.shuffle(deck);
	}
	
	public Vector<String> getDeck() {//Returns Deck Vector
		return deck;
	}
	
	public String getNextCard() {//Gets Next Card in Deck
		if(position == 52) return null;
		position++;
		return deck.get(position-1);
	}
	
	public void reset() {//Resets Deck Position
		position = 0;
	}
	
	public void shuffle() {//Shuffles and Resets Deck
		Collections.shuffle(deck);
		position = 0;
	}
	
	public static void main(String args[]) {
		CardDeck deck = new CardDeck();
		System.out.println(deck.getDeck());
		System.out.println(deck.getNextCard());
		System.out.println(deck.getNextCard());
	}
	
	
}
