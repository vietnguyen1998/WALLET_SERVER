/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [TransactionID]
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
      ,[AccountID]
FROM [wallet].[dbo].[Transactions]
WHERE cast([OtherInformation] as nvarchar(max)) ='transfer-tofriend' AND [Param] LIKE @phone +'%'
ORDER BY [CreateDate] DESC
