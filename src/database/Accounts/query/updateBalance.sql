UPDATE  [dbo].[Accounts]
SET     [Balances] = [Balances] + @balance
WHERE   [Phone] = @phone;

SELECT [GroupID]
      ,[AccountName]
      ,[Balances]
      ,[Status]
FROM  [dbo].[Accounts]
WHERE [Phone] = @phone;