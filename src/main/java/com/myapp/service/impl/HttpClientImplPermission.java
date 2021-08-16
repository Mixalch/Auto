package com.myapp.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myapp.service.HttpClient;
import com.myapp.service.dto.PermissionDto;
import com.myapp.web.rest.AccountResource;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class HttpClientImplPermission implements HttpClient<PermissionDto> {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    @Override
    public String get(String url) {
        HttpRequest request = null;
        try {
            request =
                HttpRequest
                    .newBuilder()
                    .uri(new URI(url))
                    .GET()
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("X-TENANT-ID", "maksimdb")
                    .build();
        } catch (URISyntaxException e) {
            log.error(e.toString());
        }

        HttpResponse<String> response = null;
        try {
            response = java.net.http.HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException e) {
            log.error(e.toString());
        } catch (InterruptedException e) {
            log.error(e.toString());
        }

        return response.body();
    }

    @Override
    public String post(String url, PermissionDto dto, String header) {
        ObjectMapper objectMapper = new ObjectMapper();

        HttpRequest request = null;
        try {
            request =
                HttpRequest
                    .newBuilder()
                    .uri(new URI(url))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + header)
                    .header("X-TENANT-ID", "maksimdb")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(dto)))
                    .build();
        } catch (URISyntaxException | JsonProcessingException e) {
            log.error(e.toString());
        }

        HttpResponse<String> response = null;
        try {
            response = java.net.http.HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException e) {
            log.error(e.toString());
        } catch (InterruptedException e) {
            log.error(e.toString());
        }

        return response.body();
    }
}
