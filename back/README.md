# Starting the server

### Locally, in development

```powershell
dotnet run
```

### In production on Ubuntu

TODO


# Migrations

Note: there are Python scripts for dealing with the migrations too.

First you need to install the CLI for Entity Framework Core by running

```
dotnet tool install --global dotnet-ef
```

### Add a migration

```powershell
dotnet ef migrations add MyMmigrationName
```

### Adding a one-off migration

```
dotnet ef migrations add MyMigrationName --namespace Your.Namespace
```

### List migrations

```
dotnet ef migrations list
```

### Applying migrations (DEV ONLY)

```
dotnet ef database update
```
