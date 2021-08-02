package com.nixsolutions.server.entity.users;

public class PasswordChange
{
  private String oldPassword;
  private String newPassword;
  private long userId;
  
  public String getOldPassword()
  {
    return oldPassword;
  }
  
  public void setOldPassword(String oldPassword)
  {
    this.oldPassword = oldPassword;
  }
  
  public String getNewPassword()
  {
    return newPassword;
  }
  
  public void setNewPassword(String newPassword)
  {
    this.newPassword = newPassword;
  }
  
  public long getUserId()
  {
    return userId;
  }
  
  public void setUserId(long userId)
  {
    this.userId = userId;
  }
}
