package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.CarBrand;
import com.myapp.repository.CarBrandRepository;
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
 * Integration tests for the {@link CarBrandResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CarBrandResourceIT {

    private static final String DEFAULT_BRANDE = "AAAAAAAAAA";
    private static final String UPDATED_BRANDE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/car-brands";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CarBrandRepository carBrandRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCarBrandMockMvc;

    private CarBrand carBrand;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CarBrand createEntity(EntityManager em) {
        CarBrand carBrand = new CarBrand().brande(DEFAULT_BRANDE);
        return carBrand;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CarBrand createUpdatedEntity(EntityManager em) {
        CarBrand carBrand = new CarBrand().brande(UPDATED_BRANDE);
        return carBrand;
    }

    @BeforeEach
    public void initTest() {
        carBrand = createEntity(em);
    }

    @Test
    @Transactional
    void createCarBrand() throws Exception {
        int databaseSizeBeforeCreate = carBrandRepository.findAll().size();
        // Create the CarBrand
        restCarBrandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carBrand)))
            .andExpect(status().isCreated());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeCreate + 1);
        CarBrand testCarBrand = carBrandList.get(carBrandList.size() - 1);
        assertThat(testCarBrand.getBrande()).isEqualTo(DEFAULT_BRANDE);
    }

    @Test
    @Transactional
    void createCarBrandWithExistingId() throws Exception {
        // Create the CarBrand with an existing ID
        carBrand.setId(1L);

        int databaseSizeBeforeCreate = carBrandRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCarBrandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carBrand)))
            .andExpect(status().isBadRequest());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCarBrands() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        // Get all the carBrandList
        restCarBrandMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(carBrand.getId().intValue())))
            .andExpect(jsonPath("$.[*].brande").value(hasItem(DEFAULT_BRANDE)));
    }

    @Test
    @Transactional
    void getCarBrand() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        // Get the carBrand
        restCarBrandMockMvc
            .perform(get(ENTITY_API_URL_ID, carBrand.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(carBrand.getId().intValue()))
            .andExpect(jsonPath("$.brande").value(DEFAULT_BRANDE));
    }

    @Test
    @Transactional
    void getNonExistingCarBrand() throws Exception {
        // Get the carBrand
        restCarBrandMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCarBrand() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();

        // Update the carBrand
        CarBrand updatedCarBrand = carBrandRepository.findById(carBrand.getId()).get();
        // Disconnect from session so that the updates on updatedCarBrand are not directly saved in db
        em.detach(updatedCarBrand);
        updatedCarBrand.brande(UPDATED_BRANDE);

        restCarBrandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCarBrand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCarBrand))
            )
            .andExpect(status().isOk());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
        CarBrand testCarBrand = carBrandList.get(carBrandList.size() - 1);
        assertThat(testCarBrand.getBrande()).isEqualTo(UPDATED_BRANDE);
    }

    @Test
    @Transactional
    void putNonExistingCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, carBrand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(carBrand))
            )
            .andExpect(status().isBadRequest());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(carBrand))
            )
            .andExpect(status().isBadRequest());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(carBrand)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCarBrandWithPatch() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();

        // Update the carBrand using partial update
        CarBrand partialUpdatedCarBrand = new CarBrand();
        partialUpdatedCarBrand.setId(carBrand.getId());

        restCarBrandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCarBrand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCarBrand))
            )
            .andExpect(status().isOk());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
        CarBrand testCarBrand = carBrandList.get(carBrandList.size() - 1);
        assertThat(testCarBrand.getBrande()).isEqualTo(DEFAULT_BRANDE);
    }

    @Test
    @Transactional
    void fullUpdateCarBrandWithPatch() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();

        // Update the carBrand using partial update
        CarBrand partialUpdatedCarBrand = new CarBrand();
        partialUpdatedCarBrand.setId(carBrand.getId());

        partialUpdatedCarBrand.brande(UPDATED_BRANDE);

        restCarBrandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCarBrand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCarBrand))
            )
            .andExpect(status().isOk());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
        CarBrand testCarBrand = carBrandList.get(carBrandList.size() - 1);
        assertThat(testCarBrand.getBrande()).isEqualTo(UPDATED_BRANDE);
    }

    @Test
    @Transactional
    void patchNonExistingCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, carBrand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(carBrand))
            )
            .andExpect(status().isBadRequest());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(carBrand))
            )
            .andExpect(status().isBadRequest());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCarBrand() throws Exception {
        int databaseSizeBeforeUpdate = carBrandRepository.findAll().size();
        carBrand.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCarBrandMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(carBrand)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CarBrand in the database
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCarBrand() throws Exception {
        // Initialize the database
        carBrandRepository.saveAndFlush(carBrand);

        int databaseSizeBeforeDelete = carBrandRepository.findAll().size();

        // Delete the carBrand
        restCarBrandMockMvc
            .perform(delete(ENTITY_API_URL_ID, carBrand.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CarBrand> carBrandList = carBrandRepository.findAll();
        assertThat(carBrandList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
