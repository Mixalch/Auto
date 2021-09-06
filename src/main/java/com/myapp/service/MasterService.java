package com.myapp.service;

import com.myapp.domain.DeletePermission;
import com.myapp.domain.Master;
import com.myapp.domain.PermissionVM;
import java.security.Permission;
import java.util.List;
import java.util.Optional;

public interface MasterService {
    Master save(Master master);

    Optional<Master> partialUpdate(Master master);

    List<Master> findAll();

    Optional<Master> findOne(Long id);

    void delete(Master master);

    void addPermissions(List<PermissionVM> permissionVMS);

    void deletePermission(PermissionVM permissionVMS);
}
