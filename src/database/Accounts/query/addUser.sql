INSERT INTO [dbo].[Accounts]
(
       [GroupID]
      ,[AccountName]
      ,[Phone]
      ,[Password]
      ,[Balances]
      ,[Status]
)
VALUES
(
      @group
    , @accname
    , @phone
    , @password
    , @balances
    , @status
);

SELECT SCOPE_IDENTITY() AS id;