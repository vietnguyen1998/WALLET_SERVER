  UPDATE [wallet].[dbo].[Customers]
SET [Language] =  @language
 Where [AccountID] = (select [AccountID] from [Wallet].[dbo].[Accounts] where [Phone] = @phone)