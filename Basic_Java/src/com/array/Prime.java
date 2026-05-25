package com.array;

public class Prime {
    static boolean isPrime(int n) {

        if(n < 2)
            return false;

        for(int i = 2; i <= n / 2; i++) {

            if(n % i == 0)
                return false;
        }

        return true;
    }

    public static void main(String[] args) {

        int arr[] = {1,2,3,4,5,6};

        System.out.println("Prime elements:");

        for(int i = 0; i < arr.length; i++) {

            if(isPrime(arr[i])) {
                System.out.print(arr[i] + " ");
            }
        }
    }
}
