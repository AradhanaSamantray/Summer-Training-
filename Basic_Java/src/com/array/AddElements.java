package com.array;

import java.util.Scanner;

public class AddElements {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // First array input
        System.out.print("Enter size of first array: ");
        int n1 = sc.nextInt();

        int arr1[] = new int[n1];

        System.out.println("Enter elements of first array:");

        for(int i = 0; i < n1; i++) {
            arr1[i] = sc.nextInt();
        }

        // Second array input
        System.out.print("Enter size of second array: ");
        int n2 = sc.nextInt();

        int arr2[] = new int[n2];

        System.out.println("Enter elements of second array:");

        for(int i = 0; i < n2; i++) {
            arr2[i] = sc.nextInt();
        }

        // Finding maximum length
        int maxLength = Math.max(arr1.length, arr2.length);

        int result[] = new int[maxLength];

        // Adding arrays
        for(int i = 0; i < maxLength; i++) {

            int val1 = (i < arr1.length) ? arr1[i] : 0;
            int val2 = (i < arr2.length) ? arr2[i] : 0;

            result[i] = val1 + val2;
        }

        // Printing result
        System.out.print("Result Array: {");

        for(int i = 0; i < result.length; i++) {

            System.out.print(result[i]);

            if(i < result.length - 1) {
                System.out.print(", ");
            }
        }

        System.out.println("}");

        sc.close();
    }
}