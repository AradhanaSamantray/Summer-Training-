package com.number;

import java.util.Scanner;

public class CountDigits {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,c=0;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        while(n > 0) {

            c++;
            n = n / 10;
        }

        System.out.println("Digits = " + c);

        sc.close();
    }
}
