package com.array;

public class Merge {
    public static void main(String[] args) {

        int a[] = {1, 2, 3};
        int b[] = {4, 5, 6};

        int c[] = merge(a, b);

        System.out.print("Output: {");

        for(int i = 0; i < c.length; i++) {

            System.out.print(c[i]);

            if(i < c.length - 1)
                System.out.print(", ");
        }

        System.out.println("}");
    }

    public static int[] merge(int a[], int b[]) {

        int c[] = new int[a.length + b.length];

        for(int i = 0; i < a.length; i++) {
            c[i] = a[i];
        }

        for(int i = 0; i < b.length; i++) {
            c[a.length + i] = b[i];
        }

        return c;
    }
}
