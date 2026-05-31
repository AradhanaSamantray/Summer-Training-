package org.example.Driver;
import org.example.Dao.EmpDao;
import org.example.Entity.Employee;

import java.util.*;
public class EmpDriver {
    private static int choice = 0;
    private static Scanner sc = new Scanner(System.in);
    public static void main(String[]args){
        EmpDao dao = new EmpDao();
        EmpDao.connecToDb();
        do{
            System.out.println("1.Insert\n2.Delete\n3.Update\n4.DisplayAll\n5.Get Employee By Id");
            System.out.println("Enter your choice:");
            choice = sc.nextInt();
            switch(choice){
                case 1:
                    Employee e1 = new Employee();
                    System.out.println("Enter id");
                    e1.setId(sc.nextInt());
                    sc.nextLine();
                    System.out.println("Enter name");
                    e1.setName(sc.nextLine());
                    System.out.println("Enter department");
                    e1.setDep(sc.nextLine());
                    System.out.println("Enter salary amount");
                    e1.setSalary(sc.nextDouble());

                    int rows = dao.insert(e1);
                    if(rows>0){
                        System.out.println("Employee Inserted Successfully");
                    }else{
                        System.out.println("Issue in Inserting");
                    }
                    break;
                case 2:
                    System.out.println("Enter ID");
                    if(dao.deleteById(sc.nextInt())){
                    System.out.println("Data Deleted");
                    }else{
                    System.out.println("Issue in deleting the data");
                    }
                    break;
                case 3:
                    Employee emp = new Employee();
                    System.out.println("Enter the id you want to update");
                    emp.setId(sc.nextInt());
                    System.out.println("Enter the updated name");
                    sc.nextLine();
                    emp.setName(sc.nextLine());
                    System.out.println("Enter the updated Department Name");
                    emp.setDep(sc.nextLine());
                    System.out.println("Enter the updated Salary");
                    emp.setSalary(sc.nextDouble());

                    if(dao.update(emp)>0){
                        System.out.println("Data Updated");
                    }else{
                        System.out.println("Issue in Updating....");
                    }
                    break;
                case 4: dao.DisplayAll();
                    break;
                case 5:
                    System.out.println("Enter id");
                    dao.getByid(sc.nextInt());
                    break;
                default:
                    System.out.println("Invalid Input");
            }
        }while(choice!=0);
    }
}
