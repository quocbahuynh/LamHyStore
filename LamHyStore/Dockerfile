#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80/tcp


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["LamHyStore/LamHyStore.csproj", "LamHyStore/"]
COPY ["LamHyStore.Contracts/LamHyStore.Contracts.csproj", "LamHyStore.Contracts/"]
COPY ["LamHyStore.Entities/LamHyStore.Entities.csproj", "LamHyStore.Entities/"]
COPY ["LamHyStore.KioVietService/LamHyStore.KioVietService.csproj", "LamHyStore.KioVietService/"]
COPY ["LamHyStore.Presentation/LamHyStore.Presentation.csproj", "LamHyStore.Presentation/"]
COPY ["LamHyStore.Repository/LamHyStore.Repository.csproj", "LamHyStore.Repository/"]
COPY ["LamHyStore.Service/LamHyStore.Service.csproj", "LamHyStore.Service/"]
COPY ["LamHyStore.Service.Contracts/LamHyStore.Service.Contracts.csproj", "LamHyStore.Service.Contracts/"]
COPY ["LamHyStore.Shared/LamHyStore.Shared.csproj", "LamHyStore.Shared/"]
COPY ["LamHyStore.LoggerService/LamHyStore.LoggerService.csproj", "LamHyStore.LoggerService/"]
COPY ["LamHyStore.GoogleSheetService/LamHyStore.GoogleSheetService.csproj", "LamHyStore.GoogleSheetService/"]
COPY ["LamHyStore.VNpayService/LamHyStore.VNpayService.csproj", "LamHyStore.VNpayService/"]
COPY ["LamHyStore.EmailService/LamHyStore.EmailService.csproj", "LamHyStore.EmailService/"]
RUN dotnet restore "./LamHyStore/LamHyStore.csproj"
COPY . .
WORKDIR "/src/LamHyStore"
RUN dotnet build "./LamHyStore.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./LamHyStore.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LamHyStore.dll"]