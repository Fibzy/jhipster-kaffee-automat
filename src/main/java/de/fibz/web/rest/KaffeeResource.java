package de.fibz.web.rest;

import de.fibz.domain.Kaffee;
import de.fibz.repository.KaffeeRepository;
import de.fibz.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link de.fibz.domain.Kaffee}.
 */
@RestController
@RequestMapping("/api")
public class KaffeeResource {

    private final Logger log = LoggerFactory.getLogger(KaffeeResource.class);

    private static final String ENTITY_NAME = "kaffee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KaffeeRepository kaffeeRepository;

    public KaffeeResource(KaffeeRepository kaffeeRepository) {
        this.kaffeeRepository = kaffeeRepository;
    }

    /**
     * {@code POST  /kaffees} : Create a new kaffee.
     *
     * @param kaffee the kaffee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kaffee, or with status {@code 400 (Bad Request)} if the kaffee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kaffees")
    public ResponseEntity<Kaffee> createKaffee(@RequestBody Kaffee kaffee) throws URISyntaxException {
        log.debug("REST request to save Kaffee : {}", kaffee);
        if (kaffee.getId() != null) {
            throw new BadRequestAlertException("A new kaffee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Kaffee result = kaffeeRepository.save(kaffee);
        return ResponseEntity.created(new URI("/api/kaffees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kaffees} : Updates an existing kaffee.
     *
     * @param kaffee the kaffee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kaffee,
     * or with status {@code 400 (Bad Request)} if the kaffee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kaffee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kaffees")
    public ResponseEntity<Kaffee> updateKaffee(@RequestBody Kaffee kaffee) throws URISyntaxException {
        log.debug("REST request to update Kaffee : {}", kaffee);
        if (kaffee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Kaffee result = kaffeeRepository.save(kaffee);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kaffee.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /kaffees} : get all the kaffees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kaffees in body.
     */
    @GetMapping("/kaffees")
    public List<Kaffee> getAllKaffees() {
        log.debug("REST request to get all Kaffees");
        return kaffeeRepository.findAll();
    }

    /**
     * {@code GET  /kaffees/:id} : get the "id" kaffee.
     *
     * @param id the id of the kaffee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kaffee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kaffees/{id}")
    public ResponseEntity<Kaffee> getKaffee(@PathVariable Long id) {
        log.debug("REST request to get Kaffee : {}", id);
        Optional<Kaffee> kaffee = kaffeeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kaffee);
    }

    /**
     * {@code DELETE  /kaffees/:id} : delete the "id" kaffee.
     *
     * @param id the id of the kaffee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kaffees/{id}")
    public ResponseEntity<Void> deleteKaffee(@PathVariable Long id) {
        log.debug("REST request to delete Kaffee : {}", id);
        kaffeeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
