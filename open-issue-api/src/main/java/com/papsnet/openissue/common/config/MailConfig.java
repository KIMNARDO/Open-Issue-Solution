package com.papsnet.openissue.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender javaMailSender(Environment env) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        String host = env.getProperty("spring.mail.host");
        Integer port = env.getProperty("spring.mail.port", Integer.class);
        String username = env.getProperty("spring.mail.username");
        String password = env.getProperty("spring.mail.password");

        if (host != null) sender.setHost(host);
        if (port != null) sender.setPort(port);
        if (username != null) sender.setUsername(username);
        if (password != null) sender.setPassword(password);

        Properties props = new Properties();
        props.put("mail.mime.charset", env.getProperty("spring.mail.properties.mail.mime.charset", "UTF-8"));
        props.put("mail.debug", env.getProperty("spring.mail.properties.mail.debug", "false"));
        props.put("mail.smtp.auth", env.getProperty("spring.mail.properties.mail.smtp.auth", "false"));
        props.put("mail.smtp.timeout", env.getProperty("spring.mail.properties.mail.smtp.timeout", "5000"));
        props.put("mail.smtp.starttls.enable", env.getProperty("spring.mail.properties.mail.smtp.starttls.enable", "false"));
        props.put("mail.smtp.ssl.enable", env.getProperty("spring.mail.properties.mail.smtp.ssl.enable", "false"));
        String trust = env.getProperty("spring.mail.properties.mail.smtp.ssl.trust");
        if (trust != null) props.put("mail.smtp.ssl.trust", trust);

        sender.setJavaMailProperties(props);
        return sender;
    }
}
