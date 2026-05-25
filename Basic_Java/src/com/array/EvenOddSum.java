package com.array;

public class EvenOddSum {
    public static void main(String[] args) {

        int arr[] = {1,2,3,4,5,6};

        int sumeven = 0,sumodd=0;

        for(int i = 0; i < arr.length; i++) {

            if(i % 2 == 0) {
                sumeven = sumeven + arr[i];
            }
            else{
                sumodd=sumodd+arr[i];
            }
        }

        System.out.println("Sum of even index = " + sumeven);
        System.out.println("Sum of odd index = " + sumodd);

    }
}
