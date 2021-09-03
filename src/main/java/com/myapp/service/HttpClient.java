package com.myapp.service;

import java.util.List;

public interface HttpClient<T> {
    String get(String url);
    String post(String url, T entity, String token);
    String post(String uri, List<T> entity, String token);
}
