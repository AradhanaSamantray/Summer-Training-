package org.example.Dao;

import org.example.Entity.Employee;

import java.sql.*;

public class EmpDao {
    private static String url = "jdbc:mysql://localhost:3306/employee";
    private static String user = "root";
    private static String password = "Aradhana7@";
    private static Connection con = null;

    public static void connecToDb(){
        try {
            con = DriverManager.getConnection(url,user,password);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public int insert(Employee employee){
        String sql = "INSERT INTO employeedata values(?,?,?,?)";
        try {
            PreparedStatement prt = con.prepareStatement(sql);
            prt.setInt(1,employee.getId());
            prt.setString(2, employee.getName());
            prt.setString(3, employee.getDep());
            prt.setDouble(4,employee.getSalary());
            return prt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public void DisplayAll(){
        String sql = "SELECT * FROM employeedata";
        try {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery(sql);
            while(rs.next()){
                System.out.println(rs.getInt(1) + "|" +rs.getString(2) + "|"+rs.getString(3) + "|"+rs.getDouble(4));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean deleteById(int id){
        connecToDb();
        try {
            PreparedStatement prt = con.prepareStatement("DELETE FROM employeedata WHERE id=?");
            prt.setInt(1,id);
            int rows = prt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public int update(Employee emp){
        String sql = "UPDATE employeedata SET name=?,dep=?,salary=? WHERE id=?";
        try {
            PreparedStatement prt = con.prepareStatement(sql);
            prt.setString(1, emp.getName());
            prt.setString(2,emp.getDep());
            prt.setDouble(3,emp.getSalary());
            prt.setInt(4,emp.getId());
            return prt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    public void getByid(int id){
        connecToDb();
        PreparedStatement prt = null;
        try {
            prt = con.prepareStatement("SELECT * FROM employeedata WHERE id =?");
            prt.setInt(1,id);
            ResultSet rt = prt.executeQuery();
            if(rt.next()){
                System.out.println(rt.getInt(1)+"|" + rt.getString(2)+"|"+rt.getString(3)+"|"+rt.getDouble(4));
            }else{
                System.out.println("Id doesn't exist");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

}
