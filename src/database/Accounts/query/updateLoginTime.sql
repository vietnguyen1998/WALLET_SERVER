UPDATE [dbo].[Devices]
SET [LastLoginDate] =@date
WHERE [AccountID] = @AccountID AND [UniqueID] =@UniqueID