package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Master;
import com.myapp.repository.MasterRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MasterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MasterResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/masters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MasterRepository masterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMasterMockMvc;

    private Master master;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Master createEntity(EntityManager em) {
        Master master = new Master().name(DEFAULT_NAME).date(DEFAULT_DATE);
        return master;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Master createUpdatedEntity(EntityManager em) {
        Master master = new Master().name(UPDATED_NAME).date(UPDATED_DATE);
        return master;
    }

    @BeforeEach
    public void initTest() {
        master = createEntity(em);
    }

    @Test
    @Transactional
    void createMaster() throws Exception {
        int databaseSizeBeforeCreate = masterRepository.findAll().size();
        // Create the Master
        restMasterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(master)))
            .andExpect(status().isCreated());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeCreate + 1);
        Master testMaster = masterList.get(masterList.size() - 1);
        assertThat(testMaster.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMaster.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createMasterWithExistingId() throws Exception {
        // Create the Master with an existing ID
        master.setId(1L);

        int databaseSizeBeforeCreate = masterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMasterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(master)))
            .andExpect(status().isBadRequest());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMasters() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        // Get all the masterList
        restMasterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(master.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getMaster() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        // Get the master
        restMasterMockMvc
            .perform(get(ENTITY_API_URL_ID, master.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(master.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMaster() throws Exception {
        // Get the master
        restMasterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMaster() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        int databaseSizeBeforeUpdate = masterRepository.findAll().size();

        // Update the master
        Master updatedMaster = masterRepository.findById(master.getId()).get();
        // Disconnect from session so that the updates on updatedMaster are not directly saved in db
        em.detach(updatedMaster);
        updatedMaster.name(UPDATED_NAME).date(UPDATED_DATE);

        restMasterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaster.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMaster))
            )
            .andExpect(status().isOk());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
        Master testMaster = masterList.get(masterList.size() - 1);
        assertThat(testMaster.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMaster.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, master.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(master))
            )
            .andExpect(status().isBadRequest());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(master))
            )
            .andExpect(status().isBadRequest());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(master)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMasterWithPatch() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        int databaseSizeBeforeUpdate = masterRepository.findAll().size();

        // Update the master using partial update
        Master partialUpdatedMaster = new Master();
        partialUpdatedMaster.setId(master.getId());

        partialUpdatedMaster.name(UPDATED_NAME).date(UPDATED_DATE);

        restMasterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaster))
            )
            .andExpect(status().isOk());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
        Master testMaster = masterList.get(masterList.size() - 1);
        assertThat(testMaster.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMaster.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateMasterWithPatch() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        int databaseSizeBeforeUpdate = masterRepository.findAll().size();

        // Update the master using partial update
        Master partialUpdatedMaster = new Master();
        partialUpdatedMaster.setId(master.getId());

        partialUpdatedMaster.name(UPDATED_NAME).date(UPDATED_DATE);

        restMasterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaster))
            )
            .andExpect(status().isOk());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
        Master testMaster = masterList.get(masterList.size() - 1);
        assertThat(testMaster.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMaster.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, master.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(master))
            )
            .andExpect(status().isBadRequest());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(master))
            )
            .andExpect(status().isBadRequest());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMaster() throws Exception {
        int databaseSizeBeforeUpdate = masterRepository.findAll().size();
        master.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMasterMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(master)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Master in the database
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMaster() throws Exception {
        // Initialize the database
        masterRepository.saveAndFlush(master);

        int databaseSizeBeforeDelete = masterRepository.findAll().size();

        // Delete the master
        restMasterMockMvc
            .perform(delete(ENTITY_API_URL_ID, master.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Master> masterList = masterRepository.findAll();
        assertThat(masterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
