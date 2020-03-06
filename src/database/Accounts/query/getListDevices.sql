SELECT [UniqueID],[DevicesName],[LastLoginDate]
FROM  [dbo].[Devices]
WHERE [AccountID] = @AccountID AND [Status] =1;