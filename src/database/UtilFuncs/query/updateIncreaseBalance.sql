UPDATE [wallet].[dbo].[Accounts]
SET [Balances] =  ((select [Balances] from [wallet].[dbo].[Accounts] where [Phone] = @phone) + @number)
WHERE [Phone] = @phone;