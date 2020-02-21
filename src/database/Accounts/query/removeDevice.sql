UPDATE [dbo].[Devices]
SET [Status] =0
WHERE [UniqueID] =@UniqueID AND [AccountID]=(SELECT [AccountID] FROM [dbo].[Accounts] WHERE [Phone] =@phone)