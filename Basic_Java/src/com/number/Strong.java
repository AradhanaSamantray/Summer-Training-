package com.number;

import java.util.Scanner;

public class Strong {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,sum=0,r,f,t;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        t = n;

        while(n > 0) {

            r = n % 10;

            f = 1;

            for(int i = 1; i <= r; i++) {
                f = f * i;
            }

            sum = sum + f;

            n = n / 10;
        }

        if(sum == t)
            System.out.println("Strong Number");
        else
            System.out.println("Not Strong Number");

        sc.close();
    }
}
