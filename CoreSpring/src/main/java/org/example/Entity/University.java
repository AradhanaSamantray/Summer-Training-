package org.example.Entity;
public class University {

    private String Uname;
    private String Ccode;

    public String getUname() {
        return Uname;
    }

    public void setUname(String uname) {
        Uname = uname;
    }

    public String getCcode() {
        return Ccode;
    }

    public void setCcode(String ccode) {
        Ccode = ccode;
    }

    @Override
    public String toString() {
        return "University : { " +
                "University name='" + Uname + '\'' +
                ", City code='" + Ccode + '\'' +
                '}';
    }
}
