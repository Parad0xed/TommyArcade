package game;

import java.util.Vector;

public class CardDeck {
	private Vector<String> deck;
	private int position;
	
	public CardDeck() {
		int position = 1;
		String[] temp = {
				"2-S", "3-S", "4-S", "5-S", "6-S", "7-S", "8-S", "9-S", "10-S", "J-S", "Q-S", "K-S", "A-S"
		};
		deck = new Vector<String>();
		
	}
	
	
}
