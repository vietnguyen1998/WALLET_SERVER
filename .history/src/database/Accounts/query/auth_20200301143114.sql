SELECT [AccountID]
      ,[GroupID]
      ,[AccountName]
      ,[Phone]
      ,[Password]
      ,[Balances]
      ,[Status]
FROM  [dbo].[Accounts]
WHERE [Phone] = @phone AND [Password] = @password;
