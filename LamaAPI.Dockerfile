FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS base
WORKDIR /output
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /src
COPY LamaAPI/ ./source/
COPY ./Shared/ ./Shared/
WORKDIR /src/source
RUN dotnet publish -c Release -o ./output -v n

FROM base AS final
WORKDIR /output
ENTRYPOINT ["dotnet", "Lama.dll"]
