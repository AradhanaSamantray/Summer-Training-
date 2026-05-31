package org.example.Entity;

public class Book {
    private int book_id;
    private String title;
    private String author;
    private String category;
    private double price;
    public Book(int book_id,String title,String author,String category,double price){
        this.book_id = book_id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.price = price;
    }

    public Book() {
    }

    public int getBook_id() {
        return book_id;
    }

    public void setBook_id(int book_id) {
        this.book_id = book_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
