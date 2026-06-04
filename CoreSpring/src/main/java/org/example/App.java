package org.example;

import org.example.Entity.Student;
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
        ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");
        Student s1 = (Student)context.getBean("student1");
        s1.displayInfo();
        Student s2 = (Student)context.getBean("student2");
        s2.displayInfo();
        Student s3 = (Student)context.getBean("student3");
        s3.displayInfo();
    }
}
