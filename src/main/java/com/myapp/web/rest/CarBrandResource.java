package com.myapp.web.rest;

import com.myapp.domain.CarBrand;
import com.myapp.domain.PermissionVM;
import com.myapp.repository.CarBrandRepository;
import com.myapp.service.PermissionService;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.acls.domain.BasePermission;
import org.springframework.security.acls.model.Permission;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.CarBrand}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CarBrandResource {

    private final Logger log = LoggerFactory.getLogger(CarBrandResource.class);

    private static final String ENTITY_NAME = "carBrand";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CarBrandRepository carBrandRepository;

    public CarBrandResource(CarBrandRepository carBrandRepository) {
        this.carBrandRepository = carBrandRepository;
    }

    /**
     * {@code POST  /car-brands} : Create a new carBrand.
     *
     * @param carBrand the carBrand to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new carBrand, or with status {@code 400 (Bad Request)} if the carBrand has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/car-brands")
    public ResponseEntity<CarBrand> createCarBrand(@RequestBody CarBrand carBrand) throws URISyntaxException {
        log.debug("REST request to save CarBrand : {}", carBrand);
        if (carBrand.getId() != null) {
            throw new BadRequestAlertException("A new carBrand cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CarBrand result = carBrandRepository.save(carBrand);
        return ResponseEntity
            .created(new URI("/api/car-brands/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /car-brands/:id} : Updates an existing carBrand.
     *
     * @param id the id of the carBrand to save.
     * @param carBrand the carBrand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated carBrand,
     * or with status {@code 400 (Bad Request)} if the carBrand is not valid,
     * or with status {@code 500 (Internal Server Error)} if the carBrand couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/car-brands/{id}")
    public ResponseEntity<CarBrand> updateCarBrand(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CarBrand carBrand
    ) throws URISyntaxException {
        log.debug("REST request to update CarBrand : {}, {}", id, carBrand);
        if (carBrand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, carBrand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!carBrandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CarBrand result = carBrandRepository.save(carBrand);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, carBrand.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /car-brands/:id} : Partial updates given fields of an existing carBrand, field will ignore if it is null
     *
     * @param id the id of the carBrand to save.
     * @param carBrand the carBrand to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated carBrand,
     * or with status {@code 400 (Bad Request)} if the carBrand is not valid,
     * or with status {@code 404 (Not Found)} if the carBrand is not found,
     * or with status {@code 500 (Internal Server Error)} if the carBrand couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/car-brands/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CarBrand> partialUpdateCarBrand(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CarBrand carBrand
    ) throws URISyntaxException {
        log.debug("REST request to partial update CarBrand partially : {}, {}", id, carBrand);
        if (carBrand.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, carBrand.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!carBrandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CarBrand> result = carBrandRepository
            .findById(carBrand.getId())
            .map(
                existingCarBrand -> {
                    if (carBrand.getBrande() != null) {
                        existingCarBrand.setBrande(carBrand.getBrande());
                    }

                    return existingCarBrand;
                }
            )
            .map(carBrandRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, carBrand.getId().toString())
        );
    }

    /**
     * {@code GET  /car-brands} : get all the carBrands.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of carBrands in body.
     */
    @GetMapping("/car-brands")
    public List<CarBrand> getAllCarBrands() {
        log.debug("REST request to get all CarBrands");
        return carBrandRepository.findAll();
    }

    /**
     * {@code GET  /car-brands/:id} : get the "id" carBrand.
     *
     * @param id the id of the carBrand to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the carBrand, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/car-brands/{id}")
    public ResponseEntity<CarBrand> getCarBrand(@PathVariable Long id) {
        log.debug("REST request to get CarBrand : {}", id);
        Optional<CarBrand> carBrand = carBrandRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(carBrand);
    }

    /**
     * {@code DELETE  /car-brands/:id} : delete the "id" carBrand.
     *
     * @param id the id of the carBrand to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/car-brands/{id}")
    public ResponseEntity<Void> deleteCarBrand(@PathVariable Long id) {
        log.debug("REST request to delete CarBrand : {}", id);
        carBrandRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
