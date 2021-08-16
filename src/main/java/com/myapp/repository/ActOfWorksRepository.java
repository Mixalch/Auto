package com.myapp.repository;

import com.myapp.domain.ActOfWorks;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ActOfWorks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActOfWorksRepository extends JpaRepository<ActOfWorks, Long> {}
