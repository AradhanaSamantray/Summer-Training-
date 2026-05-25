package com.array;

public class Length {


        public static void main(String[] args) {

            int a[] = {1, 2, 3, 4, 5};

            int c = 0;

            try {

                while(true) {
                    int x = a[c];
                    c++;
                }

            } catch(ArrayIndexOutOfBoundsException e) {

                System.out.println("Length = " + c);
            }
        }
    }

