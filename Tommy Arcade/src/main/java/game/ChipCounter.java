package game;

public class ChipCounter {
	private int bettingPool;
	private int lowerCap;
	private int higherCap;
	
	public ChipCounter(int lowerCap, int higherCap) {
		this.lowerCap = lowerCap;
		this.higherCap = higherCap;
	}
	
	public boolean Withdraw(int chipAmount, User user)
	{
		int UserCount = user.GetChipCount();
		
		//If user tries to withdraw more chips than they have
		if((UserCount - chipAmount) < 0)
		{
			return false;
		}
		//if user tries to withdraw less than the lower/higher cap
		else if(chipAmount < lowerCap || chipAmount > higherCap)
		{
			return false;
		}
		else {
			user.AddChips(-chipAmount);
			bettingPool += chipAmount;
			return true;
		}
	}
	
	public void Deposit(User winner) {
		winner.AddChips(bettingPool);
	}
	
}
