
declare @accountID as varchar(128)
declare @temp as table (BankID varchar(128))
set @accountID  =(select AccountID from Accounts where Phone =@phone)
insert into @temp
select BankID from BankAccounts where AccountID = @accountID AND Status=1

SELECT *
FROM  [dbo].[Banks] where BankID NOT IN (select * from @temp)