select DISTINCT Cast(OtherInformation as NVarchar(Max)) AS OtherInformation from [dbo].[Transactions] where AccountID =
(SELECT AccountID FROM Accounts WHERE Phone =@phone) AND cast([InformationServices] as nvarchar(max)) ='transfer-tofriend'