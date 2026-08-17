FROM eclipse-temurin:24-jdk AS build

WORKDIR /build

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN chmod +x mvnw

COPY src src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:24-jre

WORKDIR /app

COPY --from=build /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
