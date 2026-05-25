package com.number;

import java.util.Scanner;

public class Factorial {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,f=1;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        for(int i = 1; i <= n; i++) {
            f = f * i;
        }

        System.out.println("Factorial = " + f);

        sc.close();
    }
}

