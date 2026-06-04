package org.example.Entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;


public class Car {

    private Engine engine;

    @Autowired
    @Qualifier("Heroengine")
    /*public Car(Engine engine) {
        System.out.println("Set Engine using Constructor.");
        this.engine = engine;
    }*/

    public void setEngine(Engine engine) {
        this.engine = engine;
    }

    public void Selfstart(){

        if(engine != null){
            engine.start();
        }else{
            System.out.println("Issue in Start Engine.");
        }
    }
}