package com.array;

public class OddIndex {
    public static void main(String[] args) {

        int arr[] = {1, 2, 3, 4, 5, 6};

        System.out.println("Odd index values:");

        for(int i = 1; i < arr.length; i += 2) {
            System.out.print(arr[i] + " ");
        }
    }
}
