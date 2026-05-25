package com.number;

import java.util.Scanner;

public class Swap {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int a,b;

        System.out.print("Enter two numbers: ");
        a = sc.nextInt();
        b = sc.nextInt();

        a = a + b;
        b = a - b;
        a = a - b;

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        sc.close();
    }
}
