package org.example;

import org.example.Entity.Car;
import org.example.Entity.Engine;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Hello world!
 *
 */
public class App
{
    public static void main( String[] args )
    {
        ApplicationContext ac = new ClassPathXmlApplicationContext("Config.xml");

        Engine eng = ac.getBean("Ferrari Engine", Engine.class);
        System.out.println(eng);

        Car c = ac.getBean("car", Car.class);
        System.out.println(c);
        c.Selfstart();
    }
}