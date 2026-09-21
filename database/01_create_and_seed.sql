IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    CREATE TABLE [Countries] (
        [Code] nvarchar(2) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Countries] PRIMARY KEY ([Code])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    CREATE TABLE [Suppliers] (
        [Id] int NOT NULL IDENTITY,
        [LegalName] nvarchar(250) NOT NULL,
        [CommercialName] nvarchar(250) NOT NULL,
        [TaxId] nvarchar(11) NOT NULL,
        [Phone] nvarchar(30) NOT NULL,
        [Email] nvarchar(200) NOT NULL,
        [Website] nvarchar(300) NULL,
        [Address] nvarchar(500) NOT NULL,
        [CountryCode] nvarchar(2) NOT NULL,
        [AnnualRevenue] decimal(18,2) NOT NULL,
        [LastEditedAt] datetime2 NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Suppliers_Countries_CountryCode] FOREIGN KEY ([CountryCode]) REFERENCES [Countries] ([Code]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Code', N'Name') AND [object_id] = OBJECT_ID(N'[Countries]'))
        SET IDENTITY_INSERT [Countries] ON;
    EXEC(N'INSERT INTO [Countries] ([Code], [Name])
    VALUES (N''AR'', N''Argentina''),
    (N''BR'', N''Brasil''),
    (N''CL'', N''Chile''),
    (N''CN'', N''China''),
    (N''CO'', N''Colombia''),
    (N''CU'', N''Cuba''),
    (N''DE'', N''Alemania''),
    (N''EC'', N''Ecuador''),
    (N''ES'', N''España''),
    (N''FR'', N''Francia''),
    (N''GB'', N''Reino Unido''),
    (N''IR'', N''Irán''),
    (N''MX'', N''México''),
    (N''PA'', N''Panamá''),
    (N''PE'', N''Perú''),
    (N''RU'', N''Rusia''),
    (N''US'', N''Estados Unidos''),
    (N''VE'', N''Venezuela'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Code', N'Name') AND [object_id] = OBJECT_ID(N'[Countries]'))
        SET IDENTITY_INSERT [Countries] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'AnnualRevenue', N'CommercialName', N'CountryCode', N'CreatedAt', N'Email', N'LastEditedAt', N'LegalName', N'Phone', N'TaxId', N'Website') AND [object_id] = OBJECT_ID(N'[Suppliers]'))
        SET IDENTITY_INSERT [Suppliers] ON;
    EXEC(N'INSERT INTO [Suppliers] ([Id], [Address], [AnnualRevenue], [CommercialName], [CountryCode], [CreatedAt], [Email], [LastEditedAt], [LegalName], [Phone], [TaxId], [Website])
    VALUES (1, N''Av. Javier Prado 1234, San Isidro, Lima'', 2500000.0, N''Andina Trade'', N''PE'', ''2026-01-15T12:00:00.0000000Z'', N''contacto@andinatrade.com'', ''2026-01-15T12:00:00.0000000Z'', N''Comercializadora Andina S.A.C.'', N''+51 1 4567890'', N''20123456789'', N''https://www.andinatrade.com''),
    (2, N''1200 Brickell Ave, Miami, FL'', 14750000.5, N''GlobalLog'', N''US'', ''2026-01-16T12:00:00.0000000Z'', N''info@globallog.com'', ''2026-01-16T12:00:00.0000000Z'', N''Global Logistics Corporation'', N''+1 305 5551234'', N''98765432101'', N''https://www.globallog.com''),
    (3, N''Calle 13 #504 e/ D y E, Vedado, La Habana'', 850000.0, N''Amistur'', N''CU'', ''2026-01-17T12:00:00.0000000Z'', N''ventas@amistur.cu'', ''2026-01-17T12:00:00.0000000Z'', N''Amistur Cuba S.A.'', N''+53 7 8320000'', N''11223344556'', N''https://www.amistur.cu'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'AnnualRevenue', N'CommercialName', N'CountryCode', N'CreatedAt', N'Email', N'LastEditedAt', N'LegalName', N'Phone', N'TaxId', N'Website') AND [object_id] = OBJECT_ID(N'[Suppliers]'))
        SET IDENTITY_INSERT [Suppliers] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Suppliers_CountryCode] ON [Suppliers] ([CountryCode]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Suppliers_LastEditedAt] ON [Suppliers] ([LastEditedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Suppliers_TaxId] ON [Suppliers] ([TaxId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260921060136_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260921060136_InitialCreate', N'8.0.11');
END;
GO

COMMIT;
GO

