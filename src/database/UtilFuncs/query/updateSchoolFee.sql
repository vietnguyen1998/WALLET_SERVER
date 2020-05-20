  UPDATE [wallet].[dbo].[SchoolFee]
SET Fee = 0
WHERE FeeID = (select FeeID from  [wallet].[dbo].[School] where StudentID = @student_id);