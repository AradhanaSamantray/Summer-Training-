package com.medifind.config;

import com.medifind.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;



    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(ex -> ex

                        .authenticationEntryPoint(
                                (request, response, authException) ->
                                        response.sendError(
                                                HttpStatus.UNAUTHORIZED.value(),
                                                "Unauthorized"
                                        )
                        )

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {
                                    System.out.println("ACCESS DENIED");
                                    System.out.println(SecurityContextHolder.getContext().getAuthentication());

                                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                    response.getWriter().write("Forbidden");
                                }
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/medicine/**").hasRole("ADMIN")
                        .requestMatchers("/api/medicine/**").hasAnyRole("PHARMACY", "ADMIN")

                        .requestMatchers("/api/dashboard/**") .hasRole("ADMIN")

                        .requestMatchers("/api/inventory/**").hasAnyRole("PHARMACY", "ADMIN")

                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/pharmacy/approved").hasAnyRole("USER", "PHARMACY", "ADMIN")
                        .requestMatchers("/api/pharmacy/**").hasAnyRole("PHARMACY", "ADMIN")

                        .requestMatchers("/api/search/**").hasAnyRole("USER", "PHARMACY", "ADMIN")

                        .requestMatchers("/api/booking/**").hasAnyRole("USER","PHARMACY","ADMIN")

                        .anyRequest()
                        .authenticated()
                )


                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}