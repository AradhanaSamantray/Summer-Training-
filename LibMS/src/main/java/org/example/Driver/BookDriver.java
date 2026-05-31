package org.example.Driver;
import org.example.Dao.BookDao;
import org.example.Entity.Book;

import java.util.*;
public class BookDriver {
    private static int choice = 0;
    private static Scanner sc = new Scanner(System.in);
    public static void main(String[]args){
        BookDao dao = new BookDao();
        BookDao.connecToDb();
        do{
            System.out.println("1.Add Book\n2.Delete Book\n3.Update Book\n4.Display all Books\n5.Search Book by ID");
            System.out.println("Enter your choice");
            choice = sc.nextInt();
            switch(choice){
                case 1:
                    Book b1 = new Book();
                    System.out.println("Enter book id");
                    b1.setBook_id(sc.nextInt());
                    sc.nextLine();
                    System.out.println("Enter title");
                    b1.setTitle(sc.nextLine());
                    System.out.println("Enter Author");
                    b1.setAuthor(sc.nextLine());
                    System.out.println("Enter category of the book");
                    b1.setCategory(sc.nextLine());
                    System.out.println("Enter price");
                    b1.setPrice(sc.nextDouble());
                    int rws = dao.insert(b1);
                    if (rws>0){
                        System.out.println("Book added successfully");
                    }else{
                        System.out.println("Failed to add book");
                    }
                    break;
                case 2:
                    System.out.println("Enter Book ID");
                    if(dao.deleteById(sc.nextInt())){
                        System.out.println("Book deleted successfully");
                    }else {
                        System.out.println("Book couldnot be deleted");
                    }
                    break;
                case 3:
                    Book bk = new Book();
                    System.out.println("Enter the id of the book you want to update");
                    bk.setBook_id(sc.nextInt());
                    System.out.println("Enter the updated title");
                    sc.nextLine();
                    bk.setTitle(sc.nextLine());
                    System.out.println("Enter the updated author");
                    bk.setAuthor(sc.nextLine());
                    System.out.println("Enter the updated category");
                    bk.setCategory(sc.nextLine());
                    System.out.println("Enter the updated price");
                    System.out.println(sc.nextDouble());
                    if (dao.update(bk)>0){
                        System.out.println("Book updated successfully.");
                    }else{
                        System.out.println("Book not found or update failed.");
                    }
                    break;
                case 4:dao.DisplayAll();
                break;
                case 5:
                    System.out.println("Enter Book ID");
                    dao.getByid(sc.nextInt());
                    break;
                default:
                    System.out.println("Invalid Input");
            }
        }while(choice!=0);
    }
}
