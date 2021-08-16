package com.myapp.web.rest;

import com.myapp.domain.Master;
import com.myapp.repository.MasterRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Master}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MasterResource {

    private final Logger log = LoggerFactory.getLogger(MasterResource.class);

    private static final String ENTITY_NAME = "master";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MasterRepository masterRepository;

    public MasterResource(MasterRepository masterRepository) {
        this.masterRepository = masterRepository;
    }

    /**
     * {@code POST  /masters} : Create a new master.
     *
     * @param master the master to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new master, or with status {@code 400 (Bad Request)} if the master has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/masters")
    public ResponseEntity<Master> createMaster(@RequestBody Master master) throws URISyntaxException {
        log.debug("REST request to save Master : {}", master);
        if (master.getId() != null) {
            throw new BadRequestAlertException("A new master cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Master result = masterRepository.save(master);
        return ResponseEntity
            .created(new URI("/api/masters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /masters/:id} : Updates an existing master.
     *
     * @param id the id of the master to save.
     * @param master the master to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated master,
     * or with status {@code 400 (Bad Request)} if the master is not valid,
     * or with status {@code 500 (Internal Server Error)} if the master couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/masters/{id}")
    public ResponseEntity<Master> updateMaster(@PathVariable(value = "id", required = false) final Long id, @RequestBody Master master)
        throws URISyntaxException {
        log.debug("REST request to update Master : {}, {}", id, master);
        if (master.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, master.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!masterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Master result = masterRepository.save(master);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, master.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /masters/:id} : Partial updates given fields of an existing master, field will ignore if it is null
     *
     * @param id the id of the master to save.
     * @param master the master to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated master,
     * or with status {@code 400 (Bad Request)} if the master is not valid,
     * or with status {@code 404 (Not Found)} if the master is not found,
     * or with status {@code 500 (Internal Server Error)} if the master couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/masters/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Master> partialUpdateMaster(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Master master
    ) throws URISyntaxException {
        log.debug("REST request to partial update Master partially : {}, {}", id, master);
        if (master.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, master.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!masterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Master> result = masterRepository
            .findById(master.getId())
            .map(
                existingMaster -> {
                    if (master.getName() != null) {
                        existingMaster.setName(master.getName());
                    }
                    if (master.getDate() != null) {
                        existingMaster.setDate(master.getDate());
                    }

                    return existingMaster;
                }
            )
            .map(masterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, master.getId().toString())
        );
    }

    /**
     * {@code GET  /masters} : get all the masters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of masters in body.
     */
    @GetMapping("/masters")
    public List<Master> getAllMasters() {
        log.debug("REST request to get all Masters");
        return masterRepository.findAll();
    }

    /**
     * {@code GET  /masters/:id} : get the "id" master.
     *
     * @param id the id of the master to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the master, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/masters/{id}")
    public ResponseEntity<Master> getMaster(@PathVariable Long id) {
        log.debug("REST request to get Master : {}", id);
        Optional<Master> master = masterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(master);
    }

    /**
     * {@code DELETE  /masters/:id} : delete the "id" master.
     *
     * @param id the id of the master to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/masters/{id}")
    public ResponseEntity<Void> deleteMaster(@PathVariable Long id) {
        log.debug("REST request to delete Master : {}", id);
        masterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
