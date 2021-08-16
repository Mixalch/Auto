package com.myapp.repository;

import com.myapp.domain.Master;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Master entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {
    @PostFilter("hasPermission(filterObject, 'READ') or hasPermission(filterObject, 'WRITE') or hasAuthority('ROLE_ADMIN')")
    List<Master> findAll();

    @PostAuthorize(
        "hasPermission(returnObject, 'READ') or hasPermission(returnObject, 'WRITE') or hasPermission(returnObject, 'DELETE') or hasAuthority('ROLE_ADMIN') "
    )
    Optional<Master> findById(@Param("id") Long id);
}
