
DECLARE @id as varchar(128),@sl as INT
SET @sl = (SELECT COUNT(*) FROM [dbo].[Accounts])
SET @id ='AccountID' +CONVERT(varchar(128),(@sl +1))

INSERT INTO [dbo].[Accounts]
(
      [AccountID]
      ,[GroupID]
      ,[AccountName]
      ,[Phone]
      ,[CMND]
      ,[Password]
      ,[Balances]
      ,[Status]
)
VALUES
(
      @id
    , @group
    , @accname
    , @phone
    ,@cmnd
    , @password
    , @balances
    , @status
);


INSERT INTO [dbo].[Customers] values (null, null, @id, null, null, null, null, null, 1 )

SELECT SCOPE_IDENTITY() AS id;