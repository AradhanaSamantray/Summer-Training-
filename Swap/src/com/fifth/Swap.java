package com.fifth;

public class Swap {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int a = 7;
		int b = 4;
		
		System.out.println("Original Value:");
		System.out.println("a = "+a);
		System.out.println("b = "+b);
		
		int temp = a;
        a = b;
        b = temp;
        
        System.out.println("After Swap:");
		System.out.println("a = "+a);
		System.out.println("b = "+b);
	}

}
