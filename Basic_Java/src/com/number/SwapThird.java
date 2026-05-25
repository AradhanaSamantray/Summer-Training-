package com.number;

import java.util.Scanner;

public class SwapThird {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int a,b,t;

        System.out.print("Enter two numbers: ");
        a = sc.nextInt();
        b = sc.nextInt();

        t = a;
        a = b;
        b = t;

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        sc.close();
    }
}
