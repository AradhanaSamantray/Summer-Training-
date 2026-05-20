package com.sixth;

public class Swapw {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		 int a = 15;
	        int b = 29;

	        System.out.println("Original Value:");
	        System.out.println("a = " + a);
	        System.out.println("b = " + b);

	        a = a + b;
	        b = a - b;
	        a = a - b;

	        System.out.println("After Swap:");
	        System.out.println("a = " + a);
	        System.out.println("b = " + b);

	}

}
