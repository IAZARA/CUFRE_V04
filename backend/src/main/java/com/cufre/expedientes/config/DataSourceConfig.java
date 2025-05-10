package com.cufre.expedientes.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();

        dataSource.setDriverClassName(env.getProperty("spring.datasource.driver-class-name"));
        dataSource.setJdbcUrl(env.getProperty("spring.datasource.url"));
        dataSource.setUsername(env.getProperty("spring.datasource.username"));
        dataSource.setPassword(env.getProperty("spring.datasource.password"));

        // Configuración específica de HikariCP
        dataSource.setConnectionTimeout(Long.parseLong(env.getProperty("spring.datasource.hikari.connection-timeout", "30000")));
        dataSource.setMinimumIdle(Integer.parseInt(env.getProperty("spring.datasource.hikari.minimum-idle", "5")));
        dataSource.setMaximumPoolSize(Integer.parseInt(env.getProperty("spring.datasource.hikari.maximum-pool-size", "10")));
        dataSource.setIdleTimeout(Long.parseLong(env.getProperty("spring.datasource.hikari.idle-timeout", "300000")));
        dataSource.setMaxLifetime(Long.parseLong(env.getProperty("spring.datasource.hikari.max-lifetime", "1200000")));
        dataSource.setAutoCommit(Boolean.parseBoolean(env.getProperty("spring.datasource.hikari.auto-commit", "true")));
        dataSource.setPoolName(env.getProperty("spring.datasource.hikari.pool-name", "CufreHikariPool"));
        dataSource.setConnectionTestQuery(env.getProperty("spring.datasource.hikari.connection-test-query", "SELECT 1 FROM DUAL"));

        // Optimizaciones específicas para Oracle
        dataSource.addDataSourceProperty("oracle.jdbc.fanEnabled", "false");
        dataSource.addDataSourceProperty("oracle.jdbc.implicitStatementCacheSize", "20");
        dataSource.addDataSourceProperty("oracle.jdbc.defaultConnectionValidation", "LOCAL");

        return dataSource;
    }
} 