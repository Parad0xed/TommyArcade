package game;

import java.util.Collections;
import java.util.Vector;

public class CardDeck {
	private Vector<String> deck;
	private int position;
	
	public CardDeck() {//Constructor
		int position = 0;
		String[] cards = {
				"2-S", "3-S", "4-S", "5-S", "6-S", "7-S", "8-S", "9-S", "10-S", "J-S", "Q-S", "K-S", "A-S",
				"2-C", "3-C", "4-C", "5-C", "6-C", "7-C", "8-C", "9-C", "10-C", "J-C", "Q-C", "K-C", "A-C",
				"2-H", "3-H", "4-H", "5-H", "6-H", "7-H", "8-H", "9-H", "10-H", "J-H", "Q-H", "K-H", "A-H",
				"2-D", "3-D", "4-D", "5-D", "6-D", "7-D", "8-D", "9-D", "10-D", "J-D", "Q-D", "K-D", "A-D"
		};
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
