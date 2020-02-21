/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [ID]
      ,[AccountID]
      ,[GroupID]
      ,[AccountName]
      ,[Phone]
      ,[Password]
      ,[Balances]
      ,[Status]
  FROM [wallet].[dbo].[Accounts]
   where Phone = @phone