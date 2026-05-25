package com.Oops.Inheritance;

class Student1 {
    int rollNo;
    String name;

    void getStudentDetails() {
        System.out.println("Roll Number: " + rollNo);
        System.out.println("Name: " + name);
    }
}
class Result extends Student1 {

    int marks;

    void getMarks() {
        System.out.println("Marks: " + marks);
    }
}
public class StudentDemo {
    public static void main(String[] args) {

        Result r1 = new Result();

        r1.rollNo = 117;
        r1.name = "Aradhana";
        r1.marks = 95;
        r1.getStudentDetails();
        r1.getMarks();
    }
}
