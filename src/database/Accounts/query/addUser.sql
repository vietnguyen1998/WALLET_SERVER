
DECLARE @id as varchar(128),@sl as INT
SET @sl = (SELECT COUNT(*) FROM [dbo].[Accounts])
SET @id ='AccountID' +CONVERT(varchar(128),(@sl +1))

INSERT INTO [dbo].[Accounts]
(
      [AccountID]
      ,[GroupID]
      ,[AccountName]
      ,[Phone]
      ,[Password]
      ,[Balances]
            ,[CMND]
      ,[Status]
)
VALUES
(
      @id
    , @group
    , @accname
    , @phone
     , @password
    , @balances
      ,@cmnd
    , @status
);


INSERT INTO [dbo].[Customers] values (null, null, @id, null, null, null, null, null,'vi', 1 )