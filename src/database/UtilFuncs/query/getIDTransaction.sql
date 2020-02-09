/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1) [TransactionID]
  FROM [wallet].[dbo].[Transactions]
  where [TransactionID] = (select MAX([TransactionID]) from [wallet].[dbo].[Transactions] ) and [AccountID] = (select [AccountID] from [wallet].[dbo].[Accounts] where [Phone] = @phone)