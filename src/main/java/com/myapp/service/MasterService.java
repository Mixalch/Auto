package com.myapp.service;

import com.myapp.domain.Master;
import java.util.List;
import java.util.Optional;

public interface MasterService {
    Master save(Master master);

    Optional<Master> partialUpdate(Master master);

    List<Master> findAll();

    Optional<Master> findOne(Long id);

    void delete(Master master);
}
