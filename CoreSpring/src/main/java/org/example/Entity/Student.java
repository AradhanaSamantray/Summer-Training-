package org.example.Entity;

public class Student {
    private int id;
    private String name;
    private University university;


    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    public void displayInfo(){
        System.out.println("Student id : "+id);
        System.out.println("Name of the Student : "+name);
        System.out.println(university);
    }
}