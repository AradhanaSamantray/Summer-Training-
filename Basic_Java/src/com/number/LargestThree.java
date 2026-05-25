package com.number;

import java.util.Scanner;

public class LargestThree {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int a,b,c;

        System.out.print("Enter 3 numbers: ");
        a = sc.nextInt();
        b = sc.nextInt();
        c = sc.nextInt();

        if(a > b && a > c)
            System.out.println(a + " is largest");
        else if(b > c)
            System.out.println(b + " is largest");
        else
            System.out.println(c + " is largest");

        sc.close();
    }
}
