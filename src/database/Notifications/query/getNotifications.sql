/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [NotificationID]
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