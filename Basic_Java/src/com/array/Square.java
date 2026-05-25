package com.array;

public class Square {
    public static void main(String[] args) {

        int arr[] = {1,2,3,4,5};

        System.out.println("Square of elements:");

        for(int i = 0; i < arr.length; i++) {

            int square = arr[i] * arr[i];

            System.out.print(square + " ");
        }
    }
}
