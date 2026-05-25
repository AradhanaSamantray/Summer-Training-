package com.number;

import java.util.Scanner;

public class Armstrong {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,sum=0,r,t;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        t = n;

        while(n > 0) {

            r = n % 10;
            sum = sum + (r * r * r);
            n = n / 10;
        }

        if(sum == t)
            System.out.println("Armstrong");
        else
            System.out.println("Not Armstrong");

        sc.close();
    }
}
