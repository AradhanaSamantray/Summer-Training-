package com.number;

import java.util.Scanner;

public class GCD {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int a,b,g=1;

        System.out.print("Enter two numbers: ");
        a = sc.nextInt();
        b = sc.nextInt();

        for(int i = 1; i <= a && i <= b; i++) {

            if(a % i == 0 && b % i == 0)
                g = i;
        }

        System.out.println("GCD = " + g);

        sc.close();
    }
}

