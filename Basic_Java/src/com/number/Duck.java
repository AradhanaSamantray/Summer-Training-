package com.number;

import java.util.Scanner;

public class Duck {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,r;
        boolean duck = false;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        while(n > 0) {

            r = n % 10;

            if(r == 0) {
                duck = true;
                break;
            }

            n = n / 10;
        }

        if(duck)
            System.out.println("Duck Number");
        else
            System.out.println("Not Duck Number");

        sc.close();
    }
}
