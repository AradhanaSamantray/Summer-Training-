package com.array;

public class ReverseEachElement {

    public static void main(String[] args) {

        int arr[] = {23,55,57,93,1};

        for(int i = 0; i < arr.length; i++) {

            int num = arr[i];
            int rev = 0;

            while(num > 0) {

                rev = rev * 10 + num % 10;
                num = num / 10;
            }

            System.out.print(rev+" ");
        }
    }
}
