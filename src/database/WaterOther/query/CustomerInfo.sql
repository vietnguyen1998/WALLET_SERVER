/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [ID]
      ,[MaKH]
      ,[MonthNum]
      ,[Money]
      ,[Status]
  FROM [Wallet].[dbo].[WaterProduct]
  WHERE [MaKH] = @makh