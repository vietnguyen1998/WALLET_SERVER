SELECT ba.BankAccountID,b.BankShortName,ba.BankAccountInfo FROM BankAccounts ba join Banks b on ba.BankID =b.BankID where ba.AccountID =
(SELECT AccountID FROM Accounts WHERE Phone =@phone)