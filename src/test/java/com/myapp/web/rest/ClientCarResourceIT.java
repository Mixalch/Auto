package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.ClientCar;
import com.myapp.repository.ClientCarRepository;
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
 * Integration tests for the {@link ClientCarResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientCarResourceIT {

    private static final String DEFAULT_BRANDE = "AAAAAAAAAA";
    private static final String UPDATED_BRANDE = "BBBBBBBBBB";

    private static final String DEFAULT_WIN = "AAAAAAAAAA";
    private static final String UPDATED_WIN = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_RECEIVING = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_RECEIVING = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/client-cars";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientCarRepository clientCarRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientCarMockMvc;

    private ClientCar clientCar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientCar createEntity(EntityManager em) {
        ClientCar clientCar = new ClientCar().brande(DEFAULT_BRANDE).win(DEFAULT_WIN).dateReceiving(DEFAULT_DATE_RECEIVING);
        return clientCar;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientCar createUpdatedEntity(EntityManager em) {
        ClientCar clientCar = new ClientCar().brande(UPDATED_BRANDE).win(UPDATED_WIN).dateReceiving(UPDATED_DATE_RECEIVING);
        return clientCar;
    }

    @BeforeEach
    public void initTest() {
        clientCar = createEntity(em);
    }

    @Test
    @Transactional
    void createClientCar() throws Exception {
        int databaseSizeBeforeCreate = clientCarRepository.findAll().size();
        // Create the ClientCar
        restClientCarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientCar)))
            .andExpect(status().isCreated());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeCreate + 1);
        ClientCar testClientCar = clientCarList.get(clientCarList.size() - 1);
        assertThat(testClientCar.getBrande()).isEqualTo(DEFAULT_BRANDE);
        assertThat(testClientCar.getWin()).isEqualTo(DEFAULT_WIN);
        assertThat(testClientCar.getDateReceiving()).isEqualTo(DEFAULT_DATE_RECEIVING);
    }

    @Test
    @Transactional
    void createClientCarWithExistingId() throws Exception {
        // Create the ClientCar with an existing ID
        clientCar.setId(1L);

        int databaseSizeBeforeCreate = clientCarRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientCarMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientCar)))
            .andExpect(status().isBadRequest());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClientCars() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        // Get all the clientCarList
        restClientCarMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientCar.getId().intValue())))
            .andExpect(jsonPath("$.[*].brande").value(hasItem(DEFAULT_BRANDE)))
            .andExpect(jsonPath("$.[*].win").value(hasItem(DEFAULT_WIN)))
            .andExpect(jsonPath("$.[*].dateReceiving").value(hasItem(DEFAULT_DATE_RECEIVING.toString())));
    }

    @Test
    @Transactional
    void getClientCar() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        // Get the clientCar
        restClientCarMockMvc
            .perform(get(ENTITY_API_URL_ID, clientCar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientCar.getId().intValue()))
            .andExpect(jsonPath("$.brande").value(DEFAULT_BRANDE))
            .andExpect(jsonPath("$.win").value(DEFAULT_WIN))
            .andExpect(jsonPath("$.dateReceiving").value(DEFAULT_DATE_RECEIVING.toString()));
    }

    @Test
    @Transactional
    void getNonExistingClientCar() throws Exception {
        // Get the clientCar
        restClientCarMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClientCar() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();

        // Update the clientCar
        ClientCar updatedClientCar = clientCarRepository.findById(clientCar.getId()).get();
        // Disconnect from session so that the updates on updatedClientCar are not directly saved in db
        em.detach(updatedClientCar);
        updatedClientCar.brande(UPDATED_BRANDE).win(UPDATED_WIN).dateReceiving(UPDATED_DATE_RECEIVING);

        restClientCarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientCar.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClientCar))
            )
            .andExpect(status().isOk());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
        ClientCar testClientCar = clientCarList.get(clientCarList.size() - 1);
        assertThat(testClientCar.getBrande()).isEqualTo(UPDATED_BRANDE);
        assertThat(testClientCar.getWin()).isEqualTo(UPDATED_WIN);
        assertThat(testClientCar.getDateReceiving()).isEqualTo(UPDATED_DATE_RECEIVING);
    }

    @Test
    @Transactional
    void putNonExistingClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientCar.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientCar))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientCar))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientCar)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClientCarWithPatch() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();

        // Update the clientCar using partial update
        ClientCar partialUpdatedClientCar = new ClientCar();
        partialUpdatedClientCar.setId(clientCar.getId());

        restClientCarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientCar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientCar))
            )
            .andExpect(status().isOk());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
        ClientCar testClientCar = clientCarList.get(clientCarList.size() - 1);
        assertThat(testClientCar.getBrande()).isEqualTo(DEFAULT_BRANDE);
        assertThat(testClientCar.getWin()).isEqualTo(DEFAULT_WIN);
        assertThat(testClientCar.getDateReceiving()).isEqualTo(DEFAULT_DATE_RECEIVING);
    }

    @Test
    @Transactional
    void fullUpdateClientCarWithPatch() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();

        // Update the clientCar using partial update
        ClientCar partialUpdatedClientCar = new ClientCar();
        partialUpdatedClientCar.setId(clientCar.getId());

        partialUpdatedClientCar.brande(UPDATED_BRANDE).win(UPDATED_WIN).dateReceiving(UPDATED_DATE_RECEIVING);

        restClientCarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientCar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientCar))
            )
            .andExpect(status().isOk());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
        ClientCar testClientCar = clientCarList.get(clientCarList.size() - 1);
        assertThat(testClientCar.getBrande()).isEqualTo(UPDATED_BRANDE);
        assertThat(testClientCar.getWin()).isEqualTo(UPDATED_WIN);
        assertThat(testClientCar.getDateReceiving()).isEqualTo(UPDATED_DATE_RECEIVING);
    }

    @Test
    @Transactional
    void patchNonExistingClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientCar.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientCar))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientCar))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientCar() throws Exception {
        int databaseSizeBeforeUpdate = clientCarRepository.findAll().size();
        clientCar.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientCarMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clientCar))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientCar in the database
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClientCar() throws Exception {
        // Initialize the database
        clientCarRepository.saveAndFlush(clientCar);

        int databaseSizeBeforeDelete = clientCarRepository.findAll().size();

        // Delete the clientCar
        restClientCarMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientCar.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClientCar> clientCarList = clientCarRepository.findAll();
        assertThat(clientCarList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
