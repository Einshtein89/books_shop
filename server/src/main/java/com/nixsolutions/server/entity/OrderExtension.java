package com.nixsolutions.server.entity;

public class OrderExtension extends Order
{
  
  public OrderExtension(Order order)
  {
    super(order);
  }
  
  private Book book;
  
  public Book getBook()
  {
    return book;
  }
  
  public void setBook(Book book)
  {
    this.book = book;
  }
}
