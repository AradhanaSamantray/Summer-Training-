package com.array;

public class DuplicateElement {
    public static void main(String[] args) {

        int arr[] = {1,2,1,3,2,4};

        System.out.println("Array after removing duplicates:");

        for(int i = 0; i < arr.length; i++) {

            boolean duplicate = false;

            for(int j = 0; j < i; j++) {

                if(arr[i] == arr[j]) {
                    duplicate = true;
                    break;
                }
            }

            if(!duplicate) {
                System.out.print(arr[i] + " ");
            }
        }
    }
}
