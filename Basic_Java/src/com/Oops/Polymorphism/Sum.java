package com.Oops.Polymorphism;

class Calculator {

    void add(int a, int b) {

        System.out.println("Sum = " + (a + b));
    }

    void add(int a, int b, int c) {

        System.out.println("Sum = " + (a + b + c));
    }
}

public class Sum {

    public static void main(String[] args) {

        Calculator c = new Calculator();

        c.add(10, 20);
        c.add(10, 20, 30);
    }
}
