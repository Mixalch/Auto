package com.myapp.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myapp.service.HttpClient;
import com.myapp.service.dto.AclByIdDto;
import com.myapp.web.rest.AccountResource;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HttpClientImplAcl implements HttpClient<AclByIdDto> {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    @Autowired
    private final ObjectMapper objectMapper;

    public HttpClientImplAcl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public String get(String url) {
        HttpRequest request = null;
        try {
            request = HttpRequest.newBuilder().uri(new URI(url)).header("X-TENANT-ID", "maksimdb").GET().build();
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
    public String post(String url, AclByIdDto dto, String token) {
        HttpRequest request = null;
        try {
            request =
                HttpRequest
                    .newBuilder()
                    .uri(new URI(url))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + token)
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

    @Override
    public String post(String uri, List<AclByIdDto> entity, String token) {
        HttpRequest request = null;
        try {
            request =
                HttpRequest
                    .newBuilder()
                    .uri(new URI(uri))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + token)
                    .header("X-TENANT-ID", "maksimdb")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(entity)))
                    .build();
        } catch (URISyntaxException | JsonProcessingException e) {
            log.error(e.toString());
        }

        HttpResponse<String> response = null;
        try {
            response = java.net.http.HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException | InterruptedException e) {
            log.error(e.toString());
        }

        return response.body();
    }
}
