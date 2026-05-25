package com.array;

public class ShiftZerosRight {
    public static void main(String[] args) {
        int[] input = {2, 0, 5, 3, 1, 0, 3, 1};
        shiftZerosToRight(input);

        System.out.print("Output: {");
        for (int i = 0; i < input.length; i++) {
            System.out.print(input[i]);
            if (i < input.length - 1) System.out.print(", ");
        }
        System.out.println("}");
    }

    public static void shiftZerosToRight(int[] arr) {
        int nonZeroIndex = 0;

        // Move all non-zero elements to the front
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] != 0) {
                arr[nonZeroIndex++] = arr[i];
            }
        }

        // Fill remaining positions with zeros
        while (nonZeroIndex < arr.length) {
            arr[nonZeroIndex++] = 0;
        }
    }
}
