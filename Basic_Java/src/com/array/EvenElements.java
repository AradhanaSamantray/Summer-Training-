package com.array;

public class EvenElements {
    public static void main(String[] args) {

        int arr[] = {1, 2, 3, 4, 5, 6};

        System.out.println("Even elements:");

        for(int i = 0; i < arr.length; i++) {

            if(arr[i] % 2 == 0) {
                System.out.print(arr[i] + " ");
            }
        }
    }
}
