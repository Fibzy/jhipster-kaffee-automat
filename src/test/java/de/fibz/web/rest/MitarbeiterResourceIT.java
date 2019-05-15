package de.fibz.web.rest;

import de.fibz.KaffeeautomatApp;
import de.fibz.domain.Mitarbeiter;
import de.fibz.repository.MitarbeiterRepository;
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
import java.util.List;

import static de.fibz.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link MitarbeiterResource} REST controller.
 */
@SpringBootTest(classes = KaffeeautomatApp.class)
public class MitarbeiterResourceIT {

    private static final String DEFAULT_VORNAME = "AAAAAAAAAA";
    private static final String UPDATED_VORNAME = "BBBBBBBBBB";

    private static final String DEFAULT_NACHNAME = "AAAAAAAAAA";
    private static final String UPDATED_NACHNAME = "BBBBBBBBBB";

    @Autowired
    private MitarbeiterRepository mitarbeiterRepository;

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

    private MockMvc restMitarbeiterMockMvc;

    private Mitarbeiter mitarbeiter;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MitarbeiterResource mitarbeiterResource = new MitarbeiterResource(mitarbeiterRepository);
        this.restMitarbeiterMockMvc = MockMvcBuilders.standaloneSetup(mitarbeiterResource)
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
    public static Mitarbeiter createEntity(EntityManager em) {
        Mitarbeiter mitarbeiter = new Mitarbeiter()
            .vorname(DEFAULT_VORNAME)
            .nachname(DEFAULT_NACHNAME);
        return mitarbeiter;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mitarbeiter createUpdatedEntity(EntityManager em) {
        Mitarbeiter mitarbeiter = new Mitarbeiter()
            .vorname(UPDATED_VORNAME)
            .nachname(UPDATED_NACHNAME);
        return mitarbeiter;
    }

    @BeforeEach
    public void initTest() {
        mitarbeiter = createEntity(em);
    }

    @Test
    @Transactional
    public void createMitarbeiter() throws Exception {
        int databaseSizeBeforeCreate = mitarbeiterRepository.findAll().size();

        // Create the Mitarbeiter
        restMitarbeiterMockMvc.perform(post("/api/mitarbeiters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitarbeiter)))
            .andExpect(status().isCreated());

        // Validate the Mitarbeiter in the database
        List<Mitarbeiter> mitarbeiterList = mitarbeiterRepository.findAll();
        assertThat(mitarbeiterList).hasSize(databaseSizeBeforeCreate + 1);
        Mitarbeiter testMitarbeiter = mitarbeiterList.get(mitarbeiterList.size() - 1);
        assertThat(testMitarbeiter.getVorname()).isEqualTo(DEFAULT_VORNAME);
        assertThat(testMitarbeiter.getNachname()).isEqualTo(DEFAULT_NACHNAME);
    }

    @Test
    @Transactional
    public void createMitarbeiterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = mitarbeiterRepository.findAll().size();

        // Create the Mitarbeiter with an existing ID
        mitarbeiter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMitarbeiterMockMvc.perform(post("/api/mitarbeiters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitarbeiter)))
            .andExpect(status().isBadRequest());

        // Validate the Mitarbeiter in the database
        List<Mitarbeiter> mitarbeiterList = mitarbeiterRepository.findAll();
        assertThat(mitarbeiterList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllMitarbeiters() throws Exception {
        // Initialize the database
        mitarbeiterRepository.saveAndFlush(mitarbeiter);

        // Get all the mitarbeiterList
        restMitarbeiterMockMvc.perform(get("/api/mitarbeiters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mitarbeiter.getId().intValue())))
            .andExpect(jsonPath("$.[*].vorname").value(hasItem(DEFAULT_VORNAME.toString())))
            .andExpect(jsonPath("$.[*].nachname").value(hasItem(DEFAULT_NACHNAME.toString())));
    }
    
    @Test
    @Transactional
    public void getMitarbeiter() throws Exception {
        // Initialize the database
        mitarbeiterRepository.saveAndFlush(mitarbeiter);

        // Get the mitarbeiter
        restMitarbeiterMockMvc.perform(get("/api/mitarbeiters/{id}", mitarbeiter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(mitarbeiter.getId().intValue()))
            .andExpect(jsonPath("$.vorname").value(DEFAULT_VORNAME.toString()))
            .andExpect(jsonPath("$.nachname").value(DEFAULT_NACHNAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMitarbeiter() throws Exception {
        // Get the mitarbeiter
        restMitarbeiterMockMvc.perform(get("/api/mitarbeiters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMitarbeiter() throws Exception {
        // Initialize the database
        mitarbeiterRepository.saveAndFlush(mitarbeiter);

        int databaseSizeBeforeUpdate = mitarbeiterRepository.findAll().size();

        // Update the mitarbeiter
        Mitarbeiter updatedMitarbeiter = mitarbeiterRepository.findById(mitarbeiter.getId()).get();
        // Disconnect from session so that the updates on updatedMitarbeiter are not directly saved in db
        em.detach(updatedMitarbeiter);
        updatedMitarbeiter
            .vorname(UPDATED_VORNAME)
            .nachname(UPDATED_NACHNAME);

        restMitarbeiterMockMvc.perform(put("/api/mitarbeiters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMitarbeiter)))
            .andExpect(status().isOk());

        // Validate the Mitarbeiter in the database
        List<Mitarbeiter> mitarbeiterList = mitarbeiterRepository.findAll();
        assertThat(mitarbeiterList).hasSize(databaseSizeBeforeUpdate);
        Mitarbeiter testMitarbeiter = mitarbeiterList.get(mitarbeiterList.size() - 1);
        assertThat(testMitarbeiter.getVorname()).isEqualTo(UPDATED_VORNAME);
        assertThat(testMitarbeiter.getNachname()).isEqualTo(UPDATED_NACHNAME);
    }

    @Test
    @Transactional
    public void updateNonExistingMitarbeiter() throws Exception {
        int databaseSizeBeforeUpdate = mitarbeiterRepository.findAll().size();

        // Create the Mitarbeiter

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMitarbeiterMockMvc.perform(put("/api/mitarbeiters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(mitarbeiter)))
            .andExpect(status().isBadRequest());

        // Validate the Mitarbeiter in the database
        List<Mitarbeiter> mitarbeiterList = mitarbeiterRepository.findAll();
        assertThat(mitarbeiterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMitarbeiter() throws Exception {
        // Initialize the database
        mitarbeiterRepository.saveAndFlush(mitarbeiter);

        int databaseSizeBeforeDelete = mitarbeiterRepository.findAll().size();

        // Delete the mitarbeiter
        restMitarbeiterMockMvc.perform(delete("/api/mitarbeiters/{id}", mitarbeiter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Mitarbeiter> mitarbeiterList = mitarbeiterRepository.findAll();
        assertThat(mitarbeiterList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mitarbeiter.class);
        Mitarbeiter mitarbeiter1 = new Mitarbeiter();
        mitarbeiter1.setId(1L);
        Mitarbeiter mitarbeiter2 = new Mitarbeiter();
        mitarbeiter2.setId(mitarbeiter1.getId());
        assertThat(mitarbeiter1).isEqualTo(mitarbeiter2);
        mitarbeiter2.setId(2L);
        assertThat(mitarbeiter1).isNotEqualTo(mitarbeiter2);
        mitarbeiter1.setId(null);
        assertThat(mitarbeiter1).isNotEqualTo(mitarbeiter2);
    }
}
