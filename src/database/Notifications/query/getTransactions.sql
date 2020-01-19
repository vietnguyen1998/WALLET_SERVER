/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [TransactionID]
      ,[AccountID]
      ,[ServicesID]
      ,[SourceBalance]
      ,[Amount]
      ,[TransactionFee]
      ,[CreateDate]
      ,[Content]
      ,[InfomationServices]
      ,[OtherInfomation]
      ,[Status]
FROM [wallet].[dbo].[Transactions]
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone) 