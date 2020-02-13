/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1) [TransactionID]
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
  where [TransactionID] = @transaction_id