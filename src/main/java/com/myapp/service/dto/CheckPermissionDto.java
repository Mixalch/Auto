package com.myapp.service.dto;

import com.myapp.domain.CustomObjectIdentity;
import java.io.Serializable;

public class CheckPermissionDto implements Serializable {

    private CustomObjectIdentity customObjectIdentity;
    private Object permission;

    public CheckPermissionDto() {}

    public CheckPermissionDto(CustomObjectIdentity customObjectIdentity, Object permission) {
        this.customObjectIdentity = customObjectIdentity;
        this.permission = permission;
    }

    public CustomObjectIdentity getCustomObjectIdentity() {
        return customObjectIdentity;
    }

    public Object getPermission() {
        return permission;
    }
}
