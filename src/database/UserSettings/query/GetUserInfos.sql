/****** Script for SelectTopNRows command from SSMS  ******/
SELECT customer.Email
      ,account.Phone
	  ,customer.CustomerName
	  ,account.Status
	  ,customer.Sex
	  ,customer.Identification
	  ,customer.Address
	  ,customer.Birthday
FROM [wallet].[dbo].[Customers] customer join [wallet].[dbo].[Accounts] account on customer.AccountID = account.AccountID
WHERE account.Phone = @phone