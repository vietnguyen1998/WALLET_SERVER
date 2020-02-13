/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (10) bs.BankName
  FROM [wallet].[dbo].[BankAccounts] b inner join Accounts a on a.AccountID = b.AccountID inner join Banks bs on bs.BankID=b.BankID
  where a.AccountID = (select [AccountID] from Accounts where Phone = @phone)