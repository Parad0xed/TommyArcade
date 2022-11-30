package game;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Vector;

public class Dealer{
	CardDeck deck;
	boolean gameRunning;
	private PrintWriter pw;
	private BufferedReader br;
	private Vector<String> dealerDeck;
	private Vector<String> playerDeck;
	
	public Dealer() {
		ServerSocket ss = null;
		Socket s = null;
		PrintWriter pw = null;
		BufferedReader br = null;
    	try {
    		ss = new ServerSocket(6789);
    		s = ss.accept();
    		br = new BufferedReader(new InputStreamReader(s.getInputStream()));
    		pw = new PrintWriter(s.getOutputStream());

    		gameRunning = true;
    		RunGameLoop();
    		
    	} catch (IOException ioe) {
    		System.out.println("ioe in Dealer constructor: " + ioe.getMessage());
    	}
	}
	
	public void RunGameLoop() {
		deck.shuffle();
		pw.println("Welcome To BlackJack!");
		pw.flush();
		dealerDeck.add(deck.getNextCard());
		dealerDeck.add(deck.getNextCard());
		playerDeck.add(deck.getNextCard());
		playerDeck.add(deck.getNextCard());
		pw.println("The Dealer's first card is: " + dealerDeck.firstElement());
		pw.flush();
		
		try {
			while(gameRunning)
			{
				String playerCards = "Your Cards: ";
				playerCards += PrintHand(playerDeck);
				pw.println(playerCards);
				pw.flush();
				pw.println("Hit or Stand?");
				String line = br.readLine();
				if(line.equalsIgnoreCase("Hit"))
				{
					playerDeck.add(deck.getNextCard());
				}
				else if(line.equalsIgnoreCase("Stand"))
				{
					String player = "Your Cards: ";
					player += PrintHand(playerDeck);
					pw.println(player);
					pw.flush();
					
					String dealer = "Dealers Cards: ";
					dealer += PrintHand(dealerDeck);
					pw.println(dealer);
					pw.flush();
					
					int result = FindWinner();
					
					if(result == 0)
					{
						pw.println("Dealer Busts! You win.");
					}
					else if(result == 1)
					{
						pw.println("Player Busts! Dealer wins.");
					}
					else if(result == 2)
					{
						pw.println("Draw.");
					}
					else if(result == 3)
					{
						pw.println("Dealer wins.");
					}
					else {
						pw.println("Player wins.");
					}
				}
			}
		} catch (IOException ioe) {
			System.out.println("ioe in TraderThread.run(): " + ioe.getMessage());
		}
	}
	String PrintHand(Vector<String> hand) {
		String cards = null;
		for(int i = 0; i < hand.size();i++)
		{
			if(i != hand.size() - 1)
			{
				cards += hand.elementAt(i) + ", ";
			}
			else {
				cards += hand.elementAt(i);
			}
		}
		return cards;
	}
	
	private int FindWinner() {
		
		//Calculate the Dealer Total
		int dealerTotal = 0;
		boolean dContainsAce = false;
		int aceCount = 0;
		for(int i = 0; i < dealerDeck.size(); i++)
		{
			char val = dealerDeck.firstElement().charAt(0);
			if(val == 'J' || val == 'Q' || val == 'K')
			{
				dealerTotal += 10;
			}
			else if(val == 'A')
			{
				aceCount++;
				dealerTotal += 11;
			}
			else {
				dealerTotal += Integer.parseInt(String.valueOf(val));  
			}
		}
		if(dealerTotal > 21 && dContainsAce)
		{
			for(int i = 0; i < aceCount; i++)
			{
				if(dealerTotal > 21)
				{
					dealerTotal -= 10;
				}
				else {
					break;
				}
			}
		}
		
		//Calculate the Player Total
		int playerTotal = 0;
		boolean pContainsAce = false;
		aceCount = 0;
		for(int i = 0; i < playerDeck.size(); i++)
		{
			char val = playerDeck.firstElement().charAt(0);
			if(val == 'J' || val == 'Q' || val == 'K')
			{
				playerTotal += 10;
			}
			else if(val == 'A')
			{
				pContainsAce = true;
				playerTotal += 11;
			}
			else {
				playerTotal += Integer.parseInt(String.valueOf(val));  
			}
		}
		if(playerTotal > 21 && pContainsAce)
		{
			playerTotal -= 10;
		}
		
		if(playerTotal > 21 && pContainsAce)
		{
			for(int i = 0; i < aceCount; i++)
			{
				if(playerTotal > 21)
				{
					playerTotal -= 10;
				}
				else {
					break;
				}
			}
		}
		
		gameRunning = false;
		//Find Winner
		if(dealerTotal > 21)
		{
			// 0 = Dealer Busts
			return 0;
		}
		else if(playerTotal > 21)
		{
			//1 = Player Busts
			return 1;
		}
		else if(dealerTotal == playerTotal)
		{
			//2 = Draw
			return 2;
		}
		else if(dealerTotal > playerTotal)
		{
			//3 = Dealer wins
			return 3;
		}
		else {
			//4 = Player Wins
			return 4;
		}
	}
}
