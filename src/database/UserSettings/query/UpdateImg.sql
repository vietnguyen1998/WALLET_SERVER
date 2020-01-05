UPDATE [wallet].[dbo].[Customers]
SET [Image]=@image
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone)