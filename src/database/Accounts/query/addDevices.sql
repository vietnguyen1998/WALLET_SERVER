DECLARE @id as varchar(128),@sl as INT
SET @sl = (SELECT COUNT(*) FROM [dbo].[Devices])
SET @id ='DevicesID' +CONVERT(varchar(128),(@sl +1))

INSERT INTO [Devices]
(
        [DevicesID]
       ,[AccountID]
      ,[UniqueID]
      ,[DeviceName]
      ,[LastLoginDate]
      ,[Status]

)
VALUES
(
      @id
      ,@accountID
    , @uniqueID
      ,@DeviceName
      ,@time
    ,@status
);
