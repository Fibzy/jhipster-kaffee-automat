package de.fibz.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

import de.fibz.domain.enumeration.KaffeeArt;

/**
 * A Kaffee.
 */
@Entity
@Table(name = "kaffee")
public class Kaffee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "art")
    private KaffeeArt art;

    @Column(name = "brew_time")
    private Instant brewTime;

    @ManyToOne
    @JsonIgnoreProperties("kaffees")
    private Mitarbeiter mitarbeiter;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public KaffeeArt getArt() {
        return art;
    }

    public Kaffee art(KaffeeArt art) {
        this.art = art;
        return this;
    }

    public void setArt(KaffeeArt art) {
        this.art = art;
    }

    public Instant getBrewTime() {
        return brewTime;
    }

    public Kaffee brewTime(Instant brewTime) {
        this.brewTime = brewTime;
        return this;
    }

    public void setBrewTime(Instant brewTime) {
        this.brewTime = brewTime;
    }

    public Mitarbeiter getMitarbeiter() {
        return mitarbeiter;
    }

    public Kaffee mitarbeiter(Mitarbeiter mitarbeiter) {
        this.mitarbeiter = mitarbeiter;
        return this;
    }

    public void setMitarbeiter(Mitarbeiter mitarbeiter) {
        this.mitarbeiter = mitarbeiter;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Kaffee)) {
            return false;
        }
        return id != null && id.equals(((Kaffee) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Kaffee{" +
            "id=" + getId() +
            ", art='" + getArt() + "'" +
            ", brewTime='" + getBrewTime() + "'" +
            "}";
    }
}
