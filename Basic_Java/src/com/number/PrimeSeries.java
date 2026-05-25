package com.number;

import java.util.Scanner;

public class PrimeSeries {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n,c;

        System.out.print("Enter limit: ");
        n = sc.nextInt();

        for(int i = 1; i <= n; i++) {

            c = 0;

            for(int j = 1; j <= i; j++) {

                if(i % j == 0)
                    c++;
            }

            if(c == 2)
                System.out.print(i + " ");
        }

        sc.close();
    }
}