# Stage 1: Build
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew gradlew.bat ./
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts ./

# Copy source code
COPY src/ src/

# Build the application
RUN chmod +x ./gradlew && ./gradlew clean build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /app/build/libs/practica-0.0.1-SNAPSHOT.jar app.jar

# Expose port (default Spring Boot port)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.Launch || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
