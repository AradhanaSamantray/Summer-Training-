package come.fourth;

public class SizeAndRange {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		    System.out.println("Byte Size: " + Byte.SIZE + " bits");
	        System.out.println("Byte Range: " + Byte.MIN_VALUE + " to " + Byte.MAX_VALUE);

	        System.out.println("\nShort Size: " + Short.SIZE + " bits");
	        System.out.println("Short Range: " + Short.MIN_VALUE + " to " + Short.MAX_VALUE);

	        System.out.println("\nInt Size: " + Integer.SIZE + " bits");
	        System.out.println("Int Range: " + Integer.MIN_VALUE + " to " + Integer.MAX_VALUE);

	        System.out.println("\nLong Size: " + Long.SIZE + " bits");
	        System.out.println("Long Range: " + Long.MIN_VALUE + " to " + Long.MAX_VALUE);

	        System.out.println("\nFloat Size: " + Float.SIZE + " bits");
	        System.out.println("Float Range: " + Float.MIN_VALUE + " to " + Float.MAX_VALUE);

	        System.out.println("\nDouble Size: " + Double.SIZE + " bits");
	        System.out.println("Double Range: " + Double.MIN_VALUE + " to " + Double.MAX_VALUE);

	        System.out.println("\nChar Size: " + Character.SIZE + " bits");
	        System.out.println("Char Range: " + (int)Character.MIN_VALUE + " to " + (int)Character.MAX_VALUE);

	        System.out.println("\nBoolean Size: JVM dependent (approx 1 bit)");
	        System.out.println("Boolean Values: true or false");
	}

}
