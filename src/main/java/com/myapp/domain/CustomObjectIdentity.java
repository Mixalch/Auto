package com.myapp.domain;

import java.io.Serializable;
import org.springframework.security.acls.model.ObjectIdentity;

public class CustomObjectIdentity implements ObjectIdentity {

    private Serializable identifier;
    private String type;

    public CustomObjectIdentity() {}

    public CustomObjectIdentity(Serializable identifier, String type) {
        this.identifier = identifier;
        this.type = type;
    }

    @Override
    public Serializable getIdentifier() {
        return identifier;
    }

    @Override
    public String getType() {
        return type;
    }
}
