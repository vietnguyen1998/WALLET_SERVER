UPDATE  [dbo].[Accounts]
SET     [Password] = @password
WHERE   [Phone] = @phone;
