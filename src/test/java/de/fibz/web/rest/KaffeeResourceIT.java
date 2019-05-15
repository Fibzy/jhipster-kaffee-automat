package de.fibz.web.rest;

import de.fibz.KaffeeautomatApp;
import de.fibz.domain.Kaffee;
import de.fibz.repository.KaffeeRepository;
import de.fibz.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static de.fibz.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.fibz.domain.enumeration.KaffeeArt;
/**
 * Integration tests for the {@Link KaffeeResource} REST controller.
 */
@SpringBootTest(classes = KaffeeautomatApp.class)
public class KaffeeResourceIT {

    private static final KaffeeArt DEFAULT_ART = KaffeeArt.SCHWARZ;
    private static final KaffeeArt UPDATED_ART = KaffeeArt.MILCH;

    private static final Instant DEFAULT_BREW_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BREW_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private KaffeeRepository kaffeeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restKaffeeMockMvc;

    private Kaffee kaffee;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KaffeeResource kaffeeResource = new KaffeeResource(kaffeeRepository);
        this.restKaffeeMockMvc = MockMvcBuilders.standaloneSetup(kaffeeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kaffee createEntity(EntityManager em) {
        Kaffee kaffee = new Kaffee()
            .art(DEFAULT_ART)
            .brewTime(DEFAULT_BREW_TIME);
        return kaffee;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kaffee createUpdatedEntity(EntityManager em) {
        Kaffee kaffee = new Kaffee()
            .art(UPDATED_ART)
            .brewTime(UPDATED_BREW_TIME);
        return kaffee;
    }

    @BeforeEach
    public void initTest() {
        kaffee = createEntity(em);
    }

    @Test
    @Transactional
    public void createKaffee() throws Exception {
        int databaseSizeBeforeCreate = kaffeeRepository.findAll().size();

        // Create the Kaffee
        restKaffeeMockMvc.perform(post("/api/kaffees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kaffee)))
            .andExpect(status().isCreated());

        // Validate the Kaffee in the database
        List<Kaffee> kaffeeList = kaffeeRepository.findAll();
        assertThat(kaffeeList).hasSize(databaseSizeBeforeCreate + 1);
        Kaffee testKaffee = kaffeeList.get(kaffeeList.size() - 1);
        assertThat(testKaffee.getArt()).isEqualTo(DEFAULT_ART);
        assertThat(testKaffee.getBrewTime()).isEqualTo(DEFAULT_BREW_TIME);
    }

    @Test
    @Transactional
    public void createKaffeeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kaffeeRepository.findAll().size();

        // Create the Kaffee with an existing ID
        kaffee.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKaffeeMockMvc.perform(post("/api/kaffees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kaffee)))
            .andExpect(status().isBadRequest());

        // Validate the Kaffee in the database
        List<Kaffee> kaffeeList = kaffeeRepository.findAll();
        assertThat(kaffeeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllKaffees() throws Exception {
        // Initialize the database
        kaffeeRepository.saveAndFlush(kaffee);

        // Get all the kaffeeList
        restKaffeeMockMvc.perform(get("/api/kaffees?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kaffee.getId().intValue())))
            .andExpect(jsonPath("$.[*].art").value(hasItem(DEFAULT_ART.toString())))
            .andExpect(jsonPath("$.[*].brewTime").value(hasItem(DEFAULT_BREW_TIME.toString())));
    }
    
    @Test
    @Transactional
    public void getKaffee() throws Exception {
        // Initialize the database
        kaffeeRepository.saveAndFlush(kaffee);

        // Get the kaffee
        restKaffeeMockMvc.perform(get("/api/kaffees/{id}", kaffee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(kaffee.getId().intValue()))
            .andExpect(jsonPath("$.art").value(DEFAULT_ART.toString()))
            .andExpect(jsonPath("$.brewTime").value(DEFAULT_BREW_TIME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingKaffee() throws Exception {
        // Get the kaffee
        restKaffeeMockMvc.perform(get("/api/kaffees/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKaffee() throws Exception {
        // Initialize the database
        kaffeeRepository.saveAndFlush(kaffee);

        int databaseSizeBeforeUpdate = kaffeeRepository.findAll().size();

        // Update the kaffee
        Kaffee updatedKaffee = kaffeeRepository.findById(kaffee.getId()).get();
        // Disconnect from session so that the updates on updatedKaffee are not directly saved in db
        em.detach(updatedKaffee);
        updatedKaffee
            .art(UPDATED_ART)
            .brewTime(UPDATED_BREW_TIME);

        restKaffeeMockMvc.perform(put("/api/kaffees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedKaffee)))
            .andExpect(status().isOk());

        // Validate the Kaffee in the database
        List<Kaffee> kaffeeList = kaffeeRepository.findAll();
        assertThat(kaffeeList).hasSize(databaseSizeBeforeUpdate);
        Kaffee testKaffee = kaffeeList.get(kaffeeList.size() - 1);
        assertThat(testKaffee.getArt()).isEqualTo(UPDATED_ART);
        assertThat(testKaffee.getBrewTime()).isEqualTo(UPDATED_BREW_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingKaffee() throws Exception {
        int databaseSizeBeforeUpdate = kaffeeRepository.findAll().size();

        // Create the Kaffee

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKaffeeMockMvc.perform(put("/api/kaffees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kaffee)))
            .andExpect(status().isBadRequest());

        // Validate the Kaffee in the database
        List<Kaffee> kaffeeList = kaffeeRepository.findAll();
        assertThat(kaffeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKaffee() throws Exception {
        // Initialize the database
        kaffeeRepository.saveAndFlush(kaffee);

        int databaseSizeBeforeDelete = kaffeeRepository.findAll().size();

        // Delete the kaffee
        restKaffeeMockMvc.perform(delete("/api/kaffees/{id}", kaffee.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Kaffee> kaffeeList = kaffeeRepository.findAll();
        assertThat(kaffeeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Kaffee.class);
        Kaffee kaffee1 = new Kaffee();
        kaffee1.setId(1L);
        Kaffee kaffee2 = new Kaffee();
        kaffee2.setId(kaffee1.getId());
        assertThat(kaffee1).isEqualTo(kaffee2);
        kaffee2.setId(2L);
        assertThat(kaffee1).isNotEqualTo(kaffee2);
        kaffee1.setId(null);
        assertThat(kaffee1).isNotEqualTo(kaffee2);
    }
}
