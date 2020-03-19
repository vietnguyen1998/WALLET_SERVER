/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1) [Language]
  FROM [Wallet].[dbo].[Customers]
  Where [AccountID] = (select [AccountID] from [Wallet].[dbo].[Accounts] where [Phone] = @phone)