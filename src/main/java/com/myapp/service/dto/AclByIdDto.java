package com.myapp.service.dto;

import java.util.List;
import org.springframework.security.acls.model.ObjectIdentity;
import org.springframework.security.acls.model.Sid;

public class AclByIdDto {

    private ObjectIdentity oid;

    private List<Sid> sids;

    public AclByIdDto() {}

    public AclByIdDto(ObjectIdentity oid, List<Sid> sids) {
        this.oid = oid;
        this.sids = sids;
    }

    public ObjectIdentity getOid() {
        return oid;
    }

    public List<Sid> getSids() {
        return sids;
    }
}
