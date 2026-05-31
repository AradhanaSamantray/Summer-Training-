package org.example.Dao;

import org.example.Entity.Book;

import java.sql.*;

public class BookDao {
    private static String url="jdbc:mysql://localhost:3306/library";
    private static String user="root";
    private static String password="Aradhana7@";
    private static Connection con = null;

    public static void connecToDb(){
        try {
            con= DriverManager.getConnection(url,user,password);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public int insert(Book book){
        String sql = "INSERT INTO library values(?,?,?,?,?)";
        try {
            PreparedStatement prt = con.prepareStatement(sql);
            prt.setInt(1,book.getBook_id());
            prt.setString(2,book.getTitle());
            prt.setString(3, book.getAuthor());
            prt.setString(4, book.getCategory());
            prt.setDouble(5,book.getPrice());
            return prt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public void DisplayAll(){
        String sql = "SELECT * FROM library";
        try {
            Statement stm = con.createStatement();
            ResultSet rs = stm.executeQuery(sql);
            while (rs.next()){
                System.out.println(rs.getInt(1)+"|"+rs.getString(2)+"|"+rs.getString(3)+"|"+rs.getString(4)+"|"+rs.getDouble(5));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean deleteById(int book_id){
       connecToDb();
        try {
            PreparedStatement prt = con.prepareStatement("DELETE FROM library WHERE book_id=?");
            prt.setInt(1,book_id);
            int rows = prt.executeUpdate();
            return rows>0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public int update(Book bk){
        String sql = "UPDATE library set title=?,author=?,category=?,price=? WHERE book_id=?";
        try {
            PreparedStatement prt = con.prepareStatement(sql);
            prt.setString(1, bk.getTitle());
            prt.setString(2, bk.getAuthor());
            prt.setString(3, bk.getCategory());
            prt.setDouble(4,bk.getPrice());
            prt.setInt(5,bk.getBook_id());
            return prt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public void getByid(int book_id){
        connecToDb();
        try {
            PreparedStatement prt = con.prepareStatement("SELECT * FROM library WHERE book_id=?");
            prt.setInt(1,book_id);
            ResultSet rt = prt.executeQuery();
            if(rt.next()){
                System.out.println(rt.getInt(1)+"|"+rt.getString(2)+"|"+rt.getString(3)+"|"+rt.getString(4)+"|"+rt.getDouble(5));
            }else{
                System.out.println("Book not found.");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
