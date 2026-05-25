package com.array;

public class Vowels {
    public static void main(String[] args) {

        char arr[] = {'a','b','c','d','e','f','g'};

        System.out.println("Vowels present:");

        for(int i = 0; i < arr.length; i++) {

            if(arr[i] == 'a' || arr[i] == 'e' ||
                    arr[i] == 'i' || arr[i] == 'o' ||
                    arr[i] == 'u') {

                System.out.print(arr[i] + " ");
            }
        }
    }
}
