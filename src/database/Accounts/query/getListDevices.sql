SELECT [UniqueID],[DeviceName],[LastLoginDate]
FROM  [dbo].[Devices]
WHERE [AccountID] = @AccountID AND [Status] =1;