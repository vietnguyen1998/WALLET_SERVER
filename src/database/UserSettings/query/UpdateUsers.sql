UPDATE [wallet].[dbo].[Customers]
SET [Email] = @email,
	[Identification]=@identification,
	[Sex]=@sex,
	[Address]=@address,
	[Birthday]=@birthday,
	[Image]=@image
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone)