package com.array;

public class MinimumOccurred {
    public static void main(String[] args) {

        int arr[] = {1,2,1,1,2,1};

        int minCount = arr.length;
        int minElement = arr[0];

        for(int i = 0; i < arr.length; i++) {

            int count = 0;

            for(int j = 0; j < arr.length; j++) {

                if(arr[i] == arr[j]) {
                    count++;
                }
            }

            if(count < minCount) {
                minCount = count;
                minElement = arr[i];
            }
        }

        System.out.println("Minimum occurred element = " + minElement);
        System.out.println("Count = " + minCount);
    }
}
