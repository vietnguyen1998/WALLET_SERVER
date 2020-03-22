/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [TransactionID]
      ,[AccountID]
      ,[ServicesID]
      ,[SourceBalance]
      ,[Amount]
      ,[TransactionFee]
      ,[CreateDate]
      ,[Content]
      ,[InformationServices]
      ,[OtherInformation]
      ,[Status]
      ,[ID]
      ,[Param]
FROM [wallet].[dbo].[Transactions]
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone) 
ORDER BY [CreateDate] DESC
