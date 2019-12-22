/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [PromotionID]
      ,[ServersID]
      ,[Title]
      ,[Description]
      ,[Image]
      ,[Status]
      ,[ShortDescription]
      ,[Type]
  FROM [dbo].[Promotions]
  WHERE [Type] = 'new'