package com.number;

import java.util.Scanner;

public class Spy {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,sum=0,pro=1,r;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        while(n > 0) {

            r = n % 10;

            sum = sum + r;
            pro = pro * r;

            n = n / 10;
        }

        if(sum == pro)
            System.out.println("Spy Number");
        else
            System.out.println("Not Spy Number");

        sc.close();
    }
}
