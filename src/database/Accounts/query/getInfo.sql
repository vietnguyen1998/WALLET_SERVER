SELECT [GroupID]
      ,[AccountName]
      ,[Balances]
      ,[Status]
FROM  [dbo].[Accounts]
WHERE [Phone] = @phone;