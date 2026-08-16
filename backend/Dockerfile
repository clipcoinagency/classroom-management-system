# Paths in this file assume the build context is backend/ itself — on Render
# this is achieved by setting the service's Root Directory to "backend"
# (see DEPLOYMENT.md), which scopes the Dockerfile path and build context
# together automatically.

# --- Stage 1: build the jar with Maven ---
# eclipse-temurin:17-jre (the runtime image below) has no compiler and no
# Maven, so it can't build the project itself — this stage does the actual
# compiling, and only its output (the finished jar) gets copied forward.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: lightweight runtime image ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/classconnect-backend.jar app.jar

EXPOSE 10000

# Render assigns the real port at runtime via the PORT environment variable,
# which application.properties already reads (server.port=${PORT:8080}) —
# EXPOSE here is just documentation, it doesn't itself bind anything.
ENTRYPOINT ["java", "-jar", "app.jar"]
