package de.fibz.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Mitarbeiter.
 */
@Entity
@Table(name = "mitarbeiter")
public class Mitarbeiter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vorname")
    private String vorname;

    @Column(name = "nachname")
    private String nachname;

    @OneToMany(mappedBy = "mitarbeiter")
    private Set<Kaffee> kaffees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVorname() {
        return vorname;
    }

    public Mitarbeiter vorname(String vorname) {
        this.vorname = vorname;
        return this;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String getNachname() {
        return nachname;
    }

    public Mitarbeiter nachname(String nachname) {
        this.nachname = nachname;
        return this;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public Set<Kaffee> getKaffees() {
        return kaffees;
    }

    public Mitarbeiter kaffees(Set<Kaffee> kaffees) {
        this.kaffees = kaffees;
        return this;
    }

    public Mitarbeiter addKaffee(Kaffee kaffee) {
        this.kaffees.add(kaffee);
        kaffee.setMitarbeiter(this);
        return this;
    }

    public Mitarbeiter removeKaffee(Kaffee kaffee) {
        this.kaffees.remove(kaffee);
        kaffee.setMitarbeiter(null);
        return this;
    }

    public void setKaffees(Set<Kaffee> kaffees) {
        this.kaffees = kaffees;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mitarbeiter)) {
            return false;
        }
        return id != null && id.equals(((Mitarbeiter) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Mitarbeiter{" +
            "id=" + getId() +
            ", vorname='" + getVorname() + "'" +
            ", nachname='" + getNachname() + "'" +
            "}";
    }
}
