package com.myapp.repository;

import com.myapp.domain.Master;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Master entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {}
