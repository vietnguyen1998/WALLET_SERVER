  UPDATE [other].[dbo].[WaterProduct]
SET Money = Money - @money
WHERE [MaKH] = @id;