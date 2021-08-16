package com.myapp.web.rest;

import com.myapp.domain.ClientCar;
import com.myapp.repository.ClientCarRepository;
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
 * REST controller for managing {@link com.myapp.domain.ClientCar}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClientCarResource {

    private final Logger log = LoggerFactory.getLogger(ClientCarResource.class);

    private static final String ENTITY_NAME = "clientCar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientCarRepository clientCarRepository;

    public ClientCarResource(ClientCarRepository clientCarRepository) {
        this.clientCarRepository = clientCarRepository;
    }

    /**
     * {@code POST  /client-cars} : Create a new clientCar.
     *
     * @param clientCar the clientCar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clientCar, or with status {@code 400 (Bad Request)} if the clientCar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/client-cars")
    public ResponseEntity<ClientCar> createClientCar(@RequestBody ClientCar clientCar) throws URISyntaxException {
        log.debug("REST request to save ClientCar : {}", clientCar);
        if (clientCar.getId() != null) {
            throw new BadRequestAlertException("A new clientCar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClientCar result = clientCarRepository.save(clientCar);
        return ResponseEntity
            .created(new URI("/api/client-cars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /client-cars/:id} : Updates an existing clientCar.
     *
     * @param id the id of the clientCar to save.
     * @param clientCar the clientCar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientCar,
     * or with status {@code 400 (Bad Request)} if the clientCar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clientCar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/client-cars/{id}")
    public ResponseEntity<ClientCar> updateClientCar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientCar clientCar
    ) throws URISyntaxException {
        log.debug("REST request to update ClientCar : {}, {}", id, clientCar);
        if (clientCar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientCar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientCarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClientCar result = clientCarRepository.save(clientCar);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientCar.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /client-cars/:id} : Partial updates given fields of an existing clientCar, field will ignore if it is null
     *
     * @param id the id of the clientCar to save.
     * @param clientCar the clientCar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientCar,
     * or with status {@code 400 (Bad Request)} if the clientCar is not valid,
     * or with status {@code 404 (Not Found)} if the clientCar is not found,
     * or with status {@code 500 (Internal Server Error)} if the clientCar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/client-cars/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ClientCar> partialUpdateClientCar(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientCar clientCar
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClientCar partially : {}, {}", id, clientCar);
        if (clientCar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientCar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientCarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClientCar> result = clientCarRepository
            .findById(clientCar.getId())
            .map(
                existingClientCar -> {
                    if (clientCar.getBrande() != null) {
                        existingClientCar.setBrande(clientCar.getBrande());
                    }
                    if (clientCar.getWin() != null) {
                        existingClientCar.setWin(clientCar.getWin());
                    }
                    if (clientCar.getDateReceiving() != null) {
                        existingClientCar.setDateReceiving(clientCar.getDateReceiving());
                    }

                    return existingClientCar;
                }
            )
            .map(clientCarRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientCar.getId().toString())
        );
    }

    /**
     * {@code GET  /client-cars} : get all the clientCars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clientCars in body.
     */
    @GetMapping("/client-cars")
    public List<ClientCar> getAllClientCars() {
        log.debug("REST request to get all ClientCars");
        return clientCarRepository.findAll();
    }

    /**
     * {@code GET  /client-cars/:id} : get the "id" clientCar.
     *
     * @param id the id of the clientCar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clientCar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/client-cars/{id}")
    public ResponseEntity<ClientCar> getClientCar(@PathVariable Long id) {
        log.debug("REST request to get ClientCar : {}", id);
        Optional<ClientCar> clientCar = clientCarRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clientCar);
    }

    /**
     * {@code DELETE  /client-cars/:id} : delete the "id" clientCar.
     *
     * @param id the id of the clientCar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/client-cars/{id}")
    public ResponseEntity<Void> deleteClientCar(@PathVariable Long id) {
        log.debug("REST request to delete ClientCar : {}", id);
        clientCarRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
