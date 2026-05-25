package com.array;

public class CountZeros {
    public static void main(String[] args) {

        int arr[] = {1,0,3,0,5,6,0};

        int count = 0;

        for(int i = 0; i < arr.length; i++) {

            if(arr[i] == 0) {
                count++;
            }
        }

        System.out.println("Number of zeros = " + count);
    }
}
