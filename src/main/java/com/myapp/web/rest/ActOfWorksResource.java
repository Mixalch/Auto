package com.myapp.web.rest;

import com.myapp.domain.ActOfWorks;
import com.myapp.repository.ActOfWorksRepository;
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
 * REST controller for managing {@link com.myapp.domain.ActOfWorks}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActOfWorksResource {

    private final Logger log = LoggerFactory.getLogger(ActOfWorksResource.class);

    private static final String ENTITY_NAME = "actOfWorks";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActOfWorksRepository actOfWorksRepository;

    public ActOfWorksResource(ActOfWorksRepository actOfWorksRepository) {
        this.actOfWorksRepository = actOfWorksRepository;
    }

    /**
     * {@code POST  /act-of-works} : Create a new actOfWorks.
     *
     * @param actOfWorks the actOfWorks to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actOfWorks, or with status {@code 400 (Bad Request)} if the actOfWorks has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/act-of-works")
    public ResponseEntity<ActOfWorks> createActOfWorks(@RequestBody ActOfWorks actOfWorks) throws URISyntaxException {
        log.debug("REST request to save ActOfWorks : {}", actOfWorks);
        if (actOfWorks.getId() != null) {
            throw new BadRequestAlertException("A new actOfWorks cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActOfWorks result = actOfWorksRepository.save(actOfWorks);
        return ResponseEntity
            .created(new URI("/api/act-of-works/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /act-of-works/:id} : Updates an existing actOfWorks.
     *
     * @param id the id of the actOfWorks to save.
     * @param actOfWorks the actOfWorks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actOfWorks,
     * or with status {@code 400 (Bad Request)} if the actOfWorks is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actOfWorks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/act-of-works/{id}")
    public ResponseEntity<ActOfWorks> updateActOfWorks(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActOfWorks actOfWorks
    ) throws URISyntaxException {
        log.debug("REST request to update ActOfWorks : {}, {}", id, actOfWorks);
        if (actOfWorks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actOfWorks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actOfWorksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActOfWorks result = actOfWorksRepository.save(actOfWorks);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actOfWorks.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /act-of-works/:id} : Partial updates given fields of an existing actOfWorks, field will ignore if it is null
     *
     * @param id the id of the actOfWorks to save.
     * @param actOfWorks the actOfWorks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actOfWorks,
     * or with status {@code 400 (Bad Request)} if the actOfWorks is not valid,
     * or with status {@code 404 (Not Found)} if the actOfWorks is not found,
     * or with status {@code 500 (Internal Server Error)} if the actOfWorks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/act-of-works/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ActOfWorks> partialUpdateActOfWorks(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActOfWorks actOfWorks
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActOfWorks partially : {}, {}", id, actOfWorks);
        if (actOfWorks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actOfWorks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actOfWorksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActOfWorks> result = actOfWorksRepository
            .findById(actOfWorks.getId())
            .map(
                existingActOfWorks -> {
                    if (actOfWorks.getName() != null) {
                        existingActOfWorks.setName(actOfWorks.getName());
                    }
                    if (actOfWorks.getWin() != null) {
                        existingActOfWorks.setWin(actOfWorks.getWin());
                    }
                    if (actOfWorks.getProblev() != null) {
                        existingActOfWorks.setProblev(actOfWorks.getProblev());
                    }

                    return existingActOfWorks;
                }
            )
            .map(actOfWorksRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actOfWorks.getId().toString())
        );
    }

    /**
     * {@code GET  /act-of-works} : get all the actOfWorks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actOfWorks in body.
     */
    @GetMapping("/act-of-works")
    public List<ActOfWorks> getAllActOfWorks() {
        log.debug("REST request to get all ActOfWorks");
        return actOfWorksRepository.findAll();
    }

    /**
     * {@code GET  /act-of-works/:id} : get the "id" actOfWorks.
     *
     * @param id the id of the actOfWorks to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actOfWorks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/act-of-works/{id}")
    public ResponseEntity<ActOfWorks> getActOfWorks(@PathVariable Long id) {
        log.debug("REST request to get ActOfWorks : {}", id);
        Optional<ActOfWorks> actOfWorks = actOfWorksRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actOfWorks);
    }

    /**
     * {@code DELETE  /act-of-works/:id} : delete the "id" actOfWorks.
     *
     * @param id the id of the actOfWorks to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/act-of-works/{id}")
    public ResponseEntity<Void> deleteActOfWorks(@PathVariable Long id) {
        log.debug("REST request to delete ActOfWorks : {}", id);
        actOfWorksRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
