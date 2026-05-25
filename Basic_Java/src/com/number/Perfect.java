package com.number;

import java.util.Scanner;

public class Perfect {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,sum=0;

        System.out.print("Enter number: ");
        n = sc.nextInt();

        for(int i = 1; i < n; i++) {

            if(n % i == 0) {
                sum = sum + i;
            }
        }

        if(sum == n)
            System.out.println("Perfect Number");
        else
            System.out.println("Not Perfect Number");

        sc.close();
    }
}
