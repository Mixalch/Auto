package com.myapp.service;

import com.myapp.domain.BaseEntity;
import com.myapp.security.jwt.TokenProvider;
import com.myapp.service.dto.PermissionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.acls.model.Permission;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PermissionService {

    private final HttpClient<PermissionDto> httpClient;
    private final TokenProvider tokenProvider;

    @Autowired
    public PermissionService(HttpClient<PermissionDto> httpClient, TokenProvider tokenProvider) {
        this.httpClient = httpClient;
        this.tokenProvider = tokenProvider;
    }

    public void addPermissionForUser(BaseEntity targetObj, Permission permission, String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = tokenProvider.createToken(authentication, false);
        httpClient.post(
            "http://192.168.1.30:8085/api/permission/user",
            new PermissionDto(targetObj.getId(), targetObj.getClass().getName(), permission.getMask(), username),
            token
        );
    }

    public void addPermissionForAuthority(BaseEntity targetObj, Permission permission, String authority) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = tokenProvider.createToken(authentication, false);
        httpClient.post(
            "http://192.168.1.30:8085/api/permission/authority",
            new PermissionDto(targetObj.getId(), targetObj.getClass().getName(), permission.getMask(), authority),
            token
        );
    }
}
