package com.prodify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ProdifyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProdifyBackendApplication.class, args);
    }
}
