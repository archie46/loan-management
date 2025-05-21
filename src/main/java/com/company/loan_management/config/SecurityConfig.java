package com.company.loan_management.config;

import com.company.loan_management.jwt.JwtRequestFilter;
import com.company.loan_management.service.CustomUserDetailsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security configuration class to set up JWT-based authentication, session management, and password encoding.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final CustomUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    /**
     * Constructor to initialize required services.
     *
     * @param userDetailsService Custom service to load user details.
     * @param jwtRequestFilter Filter to validate JWT in the request.
     */
    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    /**
     * Configures the security filter chain to handle HTTP requests, session management, and JWT validation.
     *
     * @param http The HttpSecurity object to configure.
     * @return Configured SecurityFilterChain.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring HTTP security...");

        // Allow certain endpoints to be accessed without authentication
        http.authorizeHttpRequests(requests ->
                requests.requestMatchers("/api/auth/login", "/","/h2-console/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v2/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/loans","/api/repayments").authenticated()// Allow login/register
                        .requestMatchers("/api/loans","/api/loan-requests/apply/**","/api/loan-requests/cancel/**","/api/users/me").hasRole("USER")
                        .requestMatchers("/api/users/**","/api/loans/**").hasRole("ADMIN")
                        .requestMatchers("/api/loans").hasRole("USER")// Only allow admin access to /admin/**
                        .requestMatchers("/api/loan-requests/manager/**").hasRole("MANAGER")
                        .anyRequest().authenticated() // Secure all other endpoints
        );

        // Set session management to stateless, as we're using JWT for authentication
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Disable CSRF, as it’s not needed with stateless JWT-based authentication
        http.csrf(AbstractHttpConfigurer::disable);

        // Allow H2 console access from the same origin
        http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        // Add the custom JWT request filter before the UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // Enable CORS support
        http.cors(c ->c.configurationSource(corsConfigurationSource()));

        logger.info("HTTP security configuration complete.");
        return http.build();
    }

    /**
     * Bean to provide BCrypt password encoder for securely hashing and verifying passwords.
     *
     * @return BCryptPasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("Creating BCryptPasswordEncoder...");
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the authentication provider to use the custom UserDetailsService and password encoder.
     *
     * @return DaoAuthenticationProvider instance.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        logger.info("Configuring DaoAuthenticationProvider...");
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Provides the authentication manager for authenticating users.
     *
     * @param authenticationConfiguration The configuration for authentication.
     * @return The AuthenticationManager instance.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        logger.info("Configuring AuthenticationManager...");
        return authenticationConfiguration.getAuthenticationManager();
    }


    private static CorsConfigurationSource corsConfigurationSource() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000/","http://localhost:5173/"));

        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Authorization", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers","Access-Control-Allow-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Credentials"));
        corsConfiguration.setAllowedMethods(Arrays.asList("Access-Control-Allow-Methods",
                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",corsConfiguration);
        return source;
    }
}