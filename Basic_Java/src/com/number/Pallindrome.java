package com.number;

import java.util.Scanner;

public class Pallindrome {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,rev=0,t;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        t = n;

        while(n > 0) {

            rev = rev * 10 + n % 10;
            n = n / 10;
        }

        if(t == rev)
            System.out.println("Palindrome");
        else
            System.out.println("Not Palindrome");

        sc.close();
    }
}
