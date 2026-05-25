package com.Oops.Abstraction;

interface Calculator {

    void add();

    void subtract();

    default void multiply() {
        System.out.println("Default Multiply Method");
    }

    static void div() {
        System.out.println("Hello I am static function of Interface");
    }
}

// Implementation class
class A implements Calculator {

    int a = 20;
    int b = 10;

    @Override
    public void add() {

        System.out.println("Addition = " + (a + b));
    }

    @Override
    public void subtract() {

        System.out.println("Subtraction = " + (a - b));
    }
}

// Driver class
public class Driver1 {

    public static void main(String[] args) {

        A obj = new A();

        obj.add();
        obj.subtract();
        obj.multiply();

        Calculator.div();
    }
}