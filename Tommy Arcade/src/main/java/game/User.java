package game;

public class User {
	//David: NOT COMPLETED !! does not include Date yet
	private int chipCount;
	private boolean isGuest;
	private boolean chipClaimed;
	
	public User(int chipCount, boolean isGuest, boolean chipClaimed)
	{
		this.chipCount = chipCount;
		this.isGuest = isGuest;
		this.chipClaimed = chipClaimed;
	}
	
	//David: Moved this function from the ChipCounter to the User Class
	public void daily()
	{
		if(!chipClaimed) {
			//David: placeholder amount idk how many chips we want to deposit daily
			chipCount += 1000;
			chipClaimed = true;
		}
	}
	
	public int GetChipCount() {
		return chipCount;
	}
	
	public void AddChips(int chips) {
		chipCount += chips;
	}
	
	public boolean isGuest() {
		return isGuest;
	}
	
	public boolean GetChipClaimed() {
		return chipClaimed;
	}
	
	public void SetChipClaimed(boolean set) {
		chipClaimed = set;
	}
	
}
