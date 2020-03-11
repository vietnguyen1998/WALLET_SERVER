
UPDATE [dbo].[BankAccounts]
SET [Status] =0
WHERE [AccountID] = (SELECT [AccountID] FROM [dbo].[Accounts] WHERE [Phone] =@phone) AND [BankID] =(SELECT [BankID] FROM [dbo].[Banks] WHERE [BankShortName] = @BankName)