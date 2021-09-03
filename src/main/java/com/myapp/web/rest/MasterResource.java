package com.myapp.web.rest;

import com.myapp.domain.DeletePermission;
import com.myapp.domain.Master;
import com.myapp.domain.PermissionVM;
import com.myapp.repository.MasterRepository;
import com.myapp.service.MasterService;
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

    private final MasterService masterService;

    private final PermissionService permissionService;

    public MasterResource(MasterRepository masterRepository, MasterService masterService, PermissionService permissionService) {
        this.masterRepository = masterRepository;
        this.masterService = masterService;
        this.permissionService = permissionService;
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
        master.setId(0L);
        Master result = masterService.save(master);
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

        Optional<Master> result = masterService.partialUpdate(master);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, master.getId().toString()))
            .body(result.get());
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

        Optional<Master> optionalMaster = masterService.partialUpdate(master);

        return ResponseUtil.wrapOrNotFound(
            optionalMaster,
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
        return masterService.findAll();
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
        Optional<Master> master = masterService.findOne(id);
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
        Optional<Master> optionalMaster = masterRepository.findOne(id);
        masterService.delete(optionalMaster.get());
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/masters/permission/authority")
    public ResponseEntity<String> addPermissionForAuthority(@RequestBody PermissionVM permissionVM) {
        Optional<Master> optionalMaster = masterRepository.findById(permissionVM.getEntityId());
        if (!optionalMaster.isPresent() && permissionVM.getEntityId() != 0) {
            return ResponseEntity.ok("book does not found");
        }
        Master master;
        if (permissionVM.getEntityId() == 0 && permissionVM.getPermission().equalsIgnoreCase("create")) {
            master = new Master();
            master.setId(0L);
        } else {
            master = optionalMaster.get();
        }
        permissionService.addPermissionForUser(
            master,
            convertFromStringToBasePermission(permissionVM.getPermission()),
            permissionVM.getUserCredentional()
        );
        permissionService.addPermissionForAuthority(
            master,
            convertFromStringToBasePermission(permissionVM.getPermission()),
            permissionVM.getUserCredentional()
        );
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/masters/permission/user")
    public ResponseEntity<String> addPermissionForUser(@RequestBody PermissionVM permissionVM) {
        Optional<Master> optionalMaster = masterRepository.findById(permissionVM.getEntityId());
        if (!optionalMaster.isPresent() && permissionVM.getEntityId() != 0) {
            return ResponseEntity.ok("book does not found");
        }
        Master master;
        if (permissionVM.getEntityId() == 0 && permissionVM.getPermission().equalsIgnoreCase("create")) {
            master = new Master();
            master.setId(0L);
        } else {
            master = optionalMaster.get();
        }
        permissionService.addPermissionForUser(
            master,
            convertFromStringToBasePermission(permissionVM.getPermission()),
            permissionVM.getUserCredentional()
        );

        permissionService.addPermissionForUser(
            master,
            convertFromStringToBasePermission(permissionVM.getPermission()),
            permissionVM.getUserCredentional()
        );
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/masters/permissions/user")
    public ResponseEntity<String> addPermissions(@RequestBody List<PermissionVM> permissionVM) {
        masterService.addPermissions(permissionVM);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/masters/delete-permission/user")
    public ResponseEntity<String> deletePermission(@RequestBody DeletePermission deletePermission) {
        masterService.deletePermission(deletePermission);
        return ResponseEntity.noContent().build();
    }

    private Permission convertFromStringToBasePermission(String permission) {
        switch (permission.toUpperCase()) {
            case "WRITE":
                return BasePermission.WRITE;
            case "ADMINISTRATION":
                return BasePermission.ADMINISTRATION;
            case "CREATE":
                return BasePermission.CREATE;
            case "DELETE":
                return BasePermission.DELETE;
            default:
                return BasePermission.READ;
        }
    }
}
