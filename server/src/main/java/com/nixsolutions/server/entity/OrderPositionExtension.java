package com.nixsolutions.server.entity;

public class OrderPositionExtension extends OrderPosition
{
  
  public OrderPositionExtension(OrderPosition orderPosition)
  {
    super(orderPosition);
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
