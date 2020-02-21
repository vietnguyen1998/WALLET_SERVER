select OtherInformation from [dbo].[Transaction] where AccountID =
(SELECT AccountID FROM Accounts WHERE Phone =@phone) AND InformationServices='transfer-tofriend'