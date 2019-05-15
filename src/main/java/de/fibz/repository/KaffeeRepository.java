package de.fibz.repository;

import de.fibz.domain.Kaffee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Kaffee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KaffeeRepository extends JpaRepository<Kaffee, Long> {

}
