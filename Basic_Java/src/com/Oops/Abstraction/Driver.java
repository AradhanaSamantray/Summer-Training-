package com.Oops.Abstraction;

abstract class Sim {

    abstract void call();
}

// Jio class
class Jio extends Sim {

    @Override
    void call() {
        System.out.println("Call connected by Jio Server");
    }
}

// Airtel class
class Airtel extends Sim {

    @Override
    void call() {
        System.out.println("Call connected by Airtel Server");
    }
}

// Phone class
class Phone {

    Sim s;

    public Phone(Sim s) {
        this.s = s;
    }

    void call() {
        s.call();
    }
}

// Driver class
public class Driver {

    public static void main(String[] args) {

        Sim s1 = new Airtel();
        Sim s2 = new Jio();

        Phone p1 = new Phone(s1);
        Phone p2 = new Phone(s2);

        p1.call();
        p2.call();
    }
}