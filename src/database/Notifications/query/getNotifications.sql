/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (10) [NotificationID]
      ,[AccountID]
      ,[GroupID]
      ,[Title]
      ,[Description]
      ,[DateStart]
      ,[DateEnd]
      ,[Image]
      ,[Status]
FROM [wallet].[dbo].[Notifications]
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone) 