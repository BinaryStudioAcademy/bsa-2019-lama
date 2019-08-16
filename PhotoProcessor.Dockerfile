FROM mcr.microsoft.com/dotnet/core/runtime:2.2-stretch-slim AS base
WORKDIR /output

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /src
COPY Processors/ source/
COPY Shared/ Shared/
WORKDIR source
RUN dotnet publish -c Release -o output

FROM base AS final
COPY --from=build /src/source/PhotoProcessor/output .
ENTRYPOINT ["dotnet", "PhotoProcessor.dll"]
