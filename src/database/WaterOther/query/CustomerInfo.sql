/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [ID]
      ,[MaKH]
      ,[MonthNum]
      ,[Money]
      ,[Status]
  FROM [other].[dbo].[WaterProduct]
  WHERE [MaKH] = @makh