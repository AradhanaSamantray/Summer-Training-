package com.array;

public class DeleteElement {

    public static void main(String[] args) {

        int a[] = {1, 2, 3, 4};

        int p = 2;

        int b[] = new int[a.length - 1];

        for(int i = 0, j = 0; i < a.length; i++) {

            if(i != p) {
                b[j] = a[i];
                j++;
            }
        }

        System.out.print("Output: {");

        for(int i = 0; i < b.length; i++) {

            System.out.print(b[i]);

            if(i < b.length - 1)
                System.out.print(", ");
        }

        System.out.println("}");
    }
}
