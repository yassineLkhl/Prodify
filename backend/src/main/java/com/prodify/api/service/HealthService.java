package com.prodify.api.service;

import com.prodify.api.model.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private final String applicationVersion;

    public HealthService(@Value("${prodify.version:0.0.1-SNAPSHOT}") String applicationVersion) {
        this.applicationVersion = applicationVersion;
    }

    public HealthResponse getHealth() {
        return HealthResponse.okay(applicationVersion);
    }
}

