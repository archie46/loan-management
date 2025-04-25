package com.company.loan_management.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI Configuration for the Loan Management System.
 * This configuration provides interactive API documentation via Swagger UI
 * for managing users, loans, and other related entities.
 * It also sets up security for API access using JWT Bearer authentication.
 */
@Configuration
public class SwaggerConfig {

    // Logger for tracking the configuration process
    private static final Logger logger = LoggerFactory.getLogger(SwaggerConfig.class);

    /**
     * Bean configuration for OpenAPI (Swagger) to define API documentation settings.
     * It specifies metadata about the API and configures JWT Bearer authentication.
     *
     * @return OpenAPI instance configured with security, title, description, version, and contact info.
     */
    @Bean
    public OpenAPI loanManagementOpenAPI() {
        final String securitySchemeName = "bearerAuth";  // The name for the security scheme

        // Log the initialization of Swagger configuration
        logger.info("Initializing Swagger API documentation for Loan Management System");

        // Return the OpenAPI instance after configuration
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("Loan Management API")  // API title in the documentation
                        .description("API documentation for managing users, loans, and other entities in the Loan Management System")  // API description
                        .version("v1.0")  // API version
                        .contact(new Contact()  // Contact details for the API support team
                                .name("Support Team")
                                .email("support@company.com")
                                .url("https://company.com")
                        ))
                // Add security requirements: JWT Bearer authentication
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,  // Security scheme definition
                                new SecurityScheme()
                                        .name(securitySchemeName)  // Security scheme name (to match in security requirements)
                                        .type(SecurityScheme.Type.HTTP)  // The scheme type is HTTP
                                        .scheme("bearer")  // The HTTP scheme is bearer token
                                        .bearerFormat("JWT")  // The expected format of the bearer token (JWT)
                        )
                );

        // Log successful Swagger initialization before returning the OpenAPI instance
        logger.info("Swagger configuration completed successfully with Bearer JWT authentication");

        return openAPI;
    }
}
