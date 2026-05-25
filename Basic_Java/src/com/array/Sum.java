package com.array;

public class Sum {

    static int digitSum(int num) {

        while(num > 9) {

            int sum = 0;

            while(num > 0) {

                sum += num % 10;
                num = num / 10;
            }

            num = sum;
        }

        return num;
    }

    public static void main(String[] args) {

        int arr[] = {23,55,57,93,10,1};

        System.out.println("Single digit sums:");

        for(int i = 0; i < arr.length; i++) {

            System.out.print(digitSum(arr[i]) + " ");
        }
    }
}
