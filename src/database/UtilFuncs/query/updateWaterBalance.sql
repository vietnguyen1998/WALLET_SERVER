  UPDATE [Wallet].[dbo].[WaterProduct]
SET Money = Money - @money
WHERE [MaKH] = @id;