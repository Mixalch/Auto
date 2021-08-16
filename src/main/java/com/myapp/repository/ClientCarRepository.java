package com.myapp.repository;

import com.myapp.domain.ClientCar;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClientCar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClientCarRepository extends JpaRepository<ClientCar, Long> {}
