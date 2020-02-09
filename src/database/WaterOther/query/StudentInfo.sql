/****** Script for SelectTopNRows command from SSMS  ******/
SELECt *
FROM [other].[dbo].[SchoolFee] s1 INNER JOIN [other].[dbo].[School] s2 ON s1.FeeID = s2.FeeID
WHERE s2.StudentID = @studentID