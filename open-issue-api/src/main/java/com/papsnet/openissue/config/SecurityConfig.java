package com.papsnet.openissue.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.papsnet.openissue.auth.filter.JsonUsernamePasswordAuthenticationFilter;
import com.papsnet.openissue.auth.filter.JwtAuthenticationFilter;
import com.papsnet.openissue.auth.handler.LoginFailureHandler;
import com.papsnet.openissue.auth.handler.LoginSuccessHandler;
import com.papsnet.openissue.auth.provider.GrAuthenticationProvider;
import com.papsnet.openissue.auth.provider.GwAuthenticationProvider;
import com.papsnet.openissue.auth.provider.JwtProvider;
import com.papsnet.openissue.security.JwtAcessDeniedHandler;
import com.papsnet.openissue.security.JwtAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Slf4j
@RequiredArgsConstructor
@Order(2)
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtProvider jwtProvider;

    private final ObjectMapper objectMapper;
    private final GrAuthenticationProvider grAuthenticationProvider;
    private final GwAuthenticationProvider gwAuthenticationProvider;
    private final LoginFailureHandler failureHandler;
    private final LoginSuccessHandler successHandler;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAcessDeniedHandler jwtAcessDeniedHandler;


    private static final String[] AUTH_WHITELIST={
            "/swagger-ui/**",       // Swagger
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/api-docs",
            "/api-docs/**",
            "/sample/hello",        // Sample
            "/signin",              // 로그인
            "/signup",              // 사용자 등록
            "/login/",            // 로그인
            "/images/**",           // 이미지
            "/download/**",          // 다운로드
            "/webhook/**",          // 웹훅
            "/api/v1/bi/summary/**" // 외부 접근 시 필요
    };


    @Bean
    public PasswordEncoder passwordEncoder() {
        log.info("👉 [SecurityConfig2] passwordEncoder");
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

//    @Bean
//    public JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter(HttpSecurity http) throws Exception {
//        log.info("👉 [SecurityConfig2] jsonUsernamePasswordAuthenticationFilter");
//        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
//        builder.authenticationProvider(grAuthenticationProvider);
//
//        JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter =
//                new JsonUsernamePasswordAuthenticationFilter(objectMapper, successHandler, failureHandler);
//        jsonUsernamePasswordAuthenticationFilter.setAuthenticationManager(builder.build());
//        return jsonUsernamePasswordAuthenticationFilter;
//    }
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.authenticationProvider(gwAuthenticationProvider); // 기본 Provider들 추가
        builder.authenticationProvider(grAuthenticationProvider); // 여러 개 등록 가능
        return builder.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        log.info("👉 [SecurityConfig2] webSecurityCustomizer");
        return (web -> web.ignoring().requestMatchers(AUTH_WHITELIST));
    }

    JwtAuthenticationFilter jwtAuthenticationFilter(JwtProvider jwtProvider) {
        return new JwtAuthenticationFilter(jwtProvider);
    }

    @Bean
    @Order(1)
    public SecurityFilterChain gwFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception{

        JsonUsernamePasswordAuthenticationFilter gwJsonUsernamePasswordAuthenticationFilter =
                new JsonUsernamePasswordAuthenticationFilter(objectMapper, successHandler, failureHandler);
        gwJsonUsernamePasswordAuthenticationFilter.setAuthenticationManager(authenticationManager);
        gwJsonUsernamePasswordAuthenticationFilter.setRequiresAuthenticationRequestMatcher(
                new AntPathRequestMatcher("/api/v1/gw/login", "POST")
        );

        log.info("👉 [SecurityConfig2] filterChain");
        http    // Cross Site Request Forgery
                .securityMatcher( "/api/v1/gw/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)     // 시큐리티가 제공해 주는 폼 로그인 UI를 사용않음.
                .httpBasic(AbstractHttpConfigurer::disable)     // Basic 인증 사용안함
                .headers(header->header.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

//        http
//                .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configure(http));
        http.cors(Customizer.withDefaults());

        http
                .exceptionHandling(config -> {
                    config.authenticationEntryPoint(jwtAuthenticationEntryPoint);   // 401 Unauthoriaed exception
                    config.accessDeniedHandler(jwtAcessDeniedHandler);              // 403 Forbidden exception
                });

        http.authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.POST, "/api/v1/gw/login").permitAll()
//                .requestMatchers(HttpMethod.GET, "/gw").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
        );

        http.addFilterBefore(gwJsonUsernamePasswordAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception{
        log.info("👉 [SecurityConfig2] filterChain");

        JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter =
                new JsonUsernamePasswordAuthenticationFilter(objectMapper, successHandler, failureHandler);
        jsonUsernamePasswordAuthenticationFilter.setAuthenticationManager(authenticationManager);

        jsonUsernamePasswordAuthenticationFilter.setRequiresAuthenticationRequestMatcher(
                new AntPathRequestMatcher("/api/v1/login", "POST")
        );

        http    // Cross Site Request Forgery
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)     // 시큐리티가 제공해 주는 폼 로그인 UI를 사용않음.
                .httpBasic(AbstractHttpConfigurer::disable)     // Basic 인증 사용안함
                .headers(header->header.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

//        http
//                .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configure(http));
        http.cors(Customizer.withDefaults());

        http
                .exceptionHandling(config -> {
                    config.authenticationEntryPoint(jwtAuthenticationEntryPoint);   // 401 Unauthoriaed exception
                    config.accessDeniedHandler(jwtAcessDeniedHandler);              // 403 Forbidden exception
        });

        http.authorizeHttpRequests(authz -> authz
                .requestMatchers(AUTH_WHITELIST).permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/login").permitAll()
                .anyRequest().authenticated()
        );

        http.addFilterBefore(jsonUsernamePasswordAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
