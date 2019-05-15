package de.fibz.repository;

import de.fibz.domain.Mitarbeiter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Mitarbeiter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MitarbeiterRepository extends JpaRepository<Mitarbeiter, Long> {

}
