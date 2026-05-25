package com.array;

public class SmallestElement {
    public static void main(String[] args) {

        int arr[] = {1,2,1,3,2,4};

        int smallest = arr[0];

        for(int i = 1; i < arr.length; i++) {

            if(arr[i] < smallest) {
                smallest = arr[i];
            }
        }

        System.out.println("Smallest element = " + smallest);
    }
}
