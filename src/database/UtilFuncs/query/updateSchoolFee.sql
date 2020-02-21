  UPDATE [other].[dbo].[SchoolFee]
SET Fee = 0
WHERE FeeID = (select FeeID from  [other].[dbo].[School] where StudentID = @student_id);