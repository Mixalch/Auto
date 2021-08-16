package com.myapp.repository;

import com.myapp.domain.CarBrand;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CarBrand entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CarBrandRepository extends JpaRepository<CarBrand, Long> {}
