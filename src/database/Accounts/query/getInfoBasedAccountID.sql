SELECT [AccountID]
      ,[GroupID]
      ,[AccountName]
      ,[Phone]
FROM  [dbo].[Accounts]
WHERE [AccountID] = @AccountID;