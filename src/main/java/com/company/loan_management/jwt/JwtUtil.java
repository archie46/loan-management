package com.company.loan_management.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Logger for JwtUtil class
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final String SECRET_KEY ;
    private static final long TOKEN_VALIDITY = 1000L * 60L * 60L * 10L; // 10 hours


    /**
     * Constructor that generates a secret key using HmacSHA256 algorithm.
     * The key is then encoded using Base64 for later use in signing and validating JWTs.
     */
    public JwtUtil(){
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey = keyGenerator.generateKey();
            SECRET_KEY = Base64.getEncoder().encodeToString(secretKey.getEncoded());
            logger.info("JWT Util initialized with generated secret key.");
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error while generating the secret key for JWT.", e);
            throw new RuntimeException(e);
        }
    }


    /**
     * Extracts the username (subject) from the JWT token.
     *
     * @param token the JWT token
     * @return the username (subject) of the token
     */
    public String extractUsername(String token) {
        logger.debug("Extracting username from token.");
        return extractClaim(token, Claims::getSubject);
    }


    /**
     * Extracts the expiration date from the JWT token.
     *
     * @param token the JWT token
     * @return the expiration date of the token
     */
    public Date extractExpiration(String token) {
        logger.debug("Extracting expiration date from token.");
        return extractClaim(token, Claims::getExpiration);
    }


    /**
     * Extracts a specific claim from the JWT token.
     *
     * @param token the JWT token
     * @param claimsResolver function that resolves the claim
     * @param <T> the type of the claim
     * @return the claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        logger.debug("Extracting claim from token.");
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    /**
     * Extracts all claims from the JWT token.
     *
     * @param token the JWT token
     * @return the Claims object containing all the claims
     */
    private Claims extractAllClaims(String token) {
        logger.debug("Extracting all claims from token.");
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    /**
     * Returns the signing key used to sign the JWT token.
     *
     * @return the SecretKey used for signing and validating JWT
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Checks if the JWT token is expired.
     *
     * @param token the JWT token
     * @return true if the token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        logger.debug("Checking if token is expired.");
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a JWT token for the provided username.
     *
     * @param username the username to be included in the token
     * @return the generated JWT token
     */
    public String generateToken(String username) {
        logger.debug("Generating token for username: {}", username);
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }
    /**
     * Creates a JWT token with the provided claims and subject.
     *
     * @param claims the claims to include in the token
     * @param subject the subject (username) for which the token is created
     * @return the JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        logger.debug("Creating token with subject: {}", subject);
        return Jwts.builder().claims().add(claims).subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()* TOKEN_VALIDITY))
                .and().signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates the JWT token by checking its username and expiration status.
     *
     * @param token the JWT token
     * @param username the username to be validated
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, String username) {
        logger.debug("Validating token for username: {}", username);
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}