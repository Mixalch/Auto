package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.ActOfWorks;
import com.myapp.repository.ActOfWorksRepository;
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
 * Integration tests for the {@link ActOfWorksResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActOfWorksResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_WIN = "AAAAAAAAAA";
    private static final String UPDATED_WIN = "BBBBBBBBBB";

    private static final String DEFAULT_PROBLEV = "AAAAAAAAAA";
    private static final String UPDATED_PROBLEV = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/act-of-works";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActOfWorksRepository actOfWorksRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActOfWorksMockMvc;

    private ActOfWorks actOfWorks;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActOfWorks createEntity(EntityManager em) {
        ActOfWorks actOfWorks = new ActOfWorks().name(DEFAULT_NAME).win(DEFAULT_WIN).problev(DEFAULT_PROBLEV);
        return actOfWorks;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActOfWorks createUpdatedEntity(EntityManager em) {
        ActOfWorks actOfWorks = new ActOfWorks().name(UPDATED_NAME).win(UPDATED_WIN).problev(UPDATED_PROBLEV);
        return actOfWorks;
    }

    @BeforeEach
    public void initTest() {
        actOfWorks = createEntity(em);
    }

    @Test
    @Transactional
    void createActOfWorks() throws Exception {
        int databaseSizeBeforeCreate = actOfWorksRepository.findAll().size();
        // Create the ActOfWorks
        restActOfWorksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actOfWorks)))
            .andExpect(status().isCreated());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeCreate + 1);
        ActOfWorks testActOfWorks = actOfWorksList.get(actOfWorksList.size() - 1);
        assertThat(testActOfWorks.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActOfWorks.getWin()).isEqualTo(DEFAULT_WIN);
        assertThat(testActOfWorks.getProblev()).isEqualTo(DEFAULT_PROBLEV);
    }

    @Test
    @Transactional
    void createActOfWorksWithExistingId() throws Exception {
        // Create the ActOfWorks with an existing ID
        actOfWorks.setId(1L);

        int databaseSizeBeforeCreate = actOfWorksRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActOfWorksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actOfWorks)))
            .andExpect(status().isBadRequest());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActOfWorks() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        // Get all the actOfWorksList
        restActOfWorksMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actOfWorks.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].win").value(hasItem(DEFAULT_WIN)))
            .andExpect(jsonPath("$.[*].problev").value(hasItem(DEFAULT_PROBLEV)));
    }

    @Test
    @Transactional
    void getActOfWorks() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        // Get the actOfWorks
        restActOfWorksMockMvc
            .perform(get(ENTITY_API_URL_ID, actOfWorks.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actOfWorks.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.win").value(DEFAULT_WIN))
            .andExpect(jsonPath("$.problev").value(DEFAULT_PROBLEV));
    }

    @Test
    @Transactional
    void getNonExistingActOfWorks() throws Exception {
        // Get the actOfWorks
        restActOfWorksMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewActOfWorks() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();

        // Update the actOfWorks
        ActOfWorks updatedActOfWorks = actOfWorksRepository.findById(actOfWorks.getId()).get();
        // Disconnect from session so that the updates on updatedActOfWorks are not directly saved in db
        em.detach(updatedActOfWorks);
        updatedActOfWorks.name(UPDATED_NAME).win(UPDATED_WIN).problev(UPDATED_PROBLEV);

        restActOfWorksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActOfWorks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActOfWorks))
            )
            .andExpect(status().isOk());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
        ActOfWorks testActOfWorks = actOfWorksList.get(actOfWorksList.size() - 1);
        assertThat(testActOfWorks.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActOfWorks.getWin()).isEqualTo(UPDATED_WIN);
        assertThat(testActOfWorks.getProblev()).isEqualTo(UPDATED_PROBLEV);
    }

    @Test
    @Transactional
    void putNonExistingActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actOfWorks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actOfWorks))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actOfWorks))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actOfWorks)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActOfWorksWithPatch() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();

        // Update the actOfWorks using partial update
        ActOfWorks partialUpdatedActOfWorks = new ActOfWorks();
        partialUpdatedActOfWorks.setId(actOfWorks.getId());

        partialUpdatedActOfWorks.name(UPDATED_NAME).win(UPDATED_WIN);

        restActOfWorksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActOfWorks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActOfWorks))
            )
            .andExpect(status().isOk());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
        ActOfWorks testActOfWorks = actOfWorksList.get(actOfWorksList.size() - 1);
        assertThat(testActOfWorks.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActOfWorks.getWin()).isEqualTo(UPDATED_WIN);
        assertThat(testActOfWorks.getProblev()).isEqualTo(DEFAULT_PROBLEV);
    }

    @Test
    @Transactional
    void fullUpdateActOfWorksWithPatch() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();

        // Update the actOfWorks using partial update
        ActOfWorks partialUpdatedActOfWorks = new ActOfWorks();
        partialUpdatedActOfWorks.setId(actOfWorks.getId());

        partialUpdatedActOfWorks.name(UPDATED_NAME).win(UPDATED_WIN).problev(UPDATED_PROBLEV);

        restActOfWorksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActOfWorks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActOfWorks))
            )
            .andExpect(status().isOk());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
        ActOfWorks testActOfWorks = actOfWorksList.get(actOfWorksList.size() - 1);
        assertThat(testActOfWorks.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActOfWorks.getWin()).isEqualTo(UPDATED_WIN);
        assertThat(testActOfWorks.getProblev()).isEqualTo(UPDATED_PROBLEV);
    }

    @Test
    @Transactional
    void patchNonExistingActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actOfWorks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actOfWorks))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actOfWorks))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActOfWorks() throws Exception {
        int databaseSizeBeforeUpdate = actOfWorksRepository.findAll().size();
        actOfWorks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActOfWorksMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(actOfWorks))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActOfWorks in the database
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActOfWorks() throws Exception {
        // Initialize the database
        actOfWorksRepository.saveAndFlush(actOfWorks);

        int databaseSizeBeforeDelete = actOfWorksRepository.findAll().size();

        // Delete the actOfWorks
        restActOfWorksMockMvc
            .perform(delete(ENTITY_API_URL_ID, actOfWorks.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActOfWorks> actOfWorksList = actOfWorksRepository.findAll();
        assertThat(actOfWorksList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
