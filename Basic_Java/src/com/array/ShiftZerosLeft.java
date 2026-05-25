package com.array;

public class ShiftZerosLeft {
    public static void main(String[] args) {
        int[] input = {2, 0, 5, 3, 1, 0, 3, 1};
        shiftZerosToLeft(input);

        System.out.print("Output: {");
        for (int i = 0; i < input.length; i++) {
            System.out.print(input[i]);
            if (i < input.length - 1) System.out.print(", ");
        }
        System.out.println("}");
    }

    public static void shiftZerosToLeft(int[] arr) {
        int zeroIndex = arr.length - 1;

        // Move all non-zero elements to the end
        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != 0) {
                arr[zeroIndex--] = arr[i];
            }
        }

        // Fill remaining positions with zeros
        while (zeroIndex >= 0) {
            arr[zeroIndex--] = 0;
        }
    }
}