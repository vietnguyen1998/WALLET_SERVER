/****** Script for SelectTopNRows command from SSMS  ******/
SELECt *
FROM [Wallet].[dbo].[SchoolFee] s1 INNER JOIN [Wallet].[dbo].[School] s2 ON s1.FeeID = s2.FeeID
WHERE s2.StudentID = @studentID