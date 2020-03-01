
DECLARE @id as varchar(128),@sl as INT
SET @sl = (SELECT COUNT(*) FROM [BankAccounts])
SET @id ='BankAccountID' +CONVERT(varchar(128),(@sl +1))

INSERT INTO [dbo].[BankAccounts]
VALUES (@id,@bankID,'BankType1',@accountID,@bankinfo,@time)