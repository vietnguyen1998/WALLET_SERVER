UPDATE [wallet].[dbo].[Customers]
SET [Email] = @email,
	[Identification]=@identification,
	[Sex]=@sex,
	[Address]=@address,
	[Birthday]=@birthday
WHERE [AccountID] = (SELECT [AccountID] From [wallet].[dbo].[Accounts] Where [Phone] = @phone)

UPDATE [wallet].[dbo].[Accounts]
SET [Password] = @password,
	[AccountName]=@accountName
WHERE [Phone] = @phone