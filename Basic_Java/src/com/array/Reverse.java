package com.array;

public class Reverse {
    public static void main(String[] args){
        char arr[] = {'A', 'R', 'A', 'D', 'H', 'A', 'N', 'A'};

        System.out.println("Characters in reverse order:");

        for(int i = arr.length - 1; i >= 0; i--) {
            System.out.print(arr[i] + " ");
        }
    }
}
