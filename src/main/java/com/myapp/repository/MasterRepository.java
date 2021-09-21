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
    @PostAuthorize(
        "hasPermission(returnObject, 'READ') or hasPermission(returnObject, 'WRITE') or hasPermission(returnObject, 'DELETE') or hasPermission(returnObject, 'ADMINISTRATION') or hasAuthority('ROLE_ADMIN')"
    )
    @Query("select master from Master master where master.id =:id")
    Optional<Master> findOneWithPermission(@Param("id") Long id);

    @Query("select master from Master master where master.id =:id")
    Optional<Master> findOne(@Param("id") Long id);
}
