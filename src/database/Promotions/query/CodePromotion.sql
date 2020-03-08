SELECT TOP 1 [ID]
      ,[CodePromotionID]
      ,[PromotionID]
      ,[Code]
      ,[Status]
  FROM [Wallet].[dbo].[CodePromotions]
  WHERE [Code] = @code