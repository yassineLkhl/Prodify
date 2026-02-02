package com.prodify.api.model;

import java.time.OffsetDateTime;

public record HealthResponse(String status, OffsetDateTime timestamp, String version) {

    public static HealthResponse okay(String version) {
        return new HealthResponse("OK", OffsetDateTime.now(), version);
    }
}
