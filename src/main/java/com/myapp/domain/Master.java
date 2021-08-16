package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Master.
 */
@Entity
@Table(name = "master")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Master implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "master")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "clientCar", "master" }, allowSetters = true)
    private Set<ActOfWorks> actOfWorks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Master id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Master name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Master date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<ActOfWorks> getActOfWorks() {
        return this.actOfWorks;
    }

    public Master actOfWorks(Set<ActOfWorks> actOfWorks) {
        this.setActOfWorks(actOfWorks);
        return this;
    }

    public Master addActOfWorks(ActOfWorks actOfWorks) {
        this.actOfWorks.add(actOfWorks);
        actOfWorks.setMaster(this);
        return this;
    }

    public Master removeActOfWorks(ActOfWorks actOfWorks) {
        this.actOfWorks.remove(actOfWorks);
        actOfWorks.setMaster(null);
        return this;
    }

    public void setActOfWorks(Set<ActOfWorks> actOfWorks) {
        if (this.actOfWorks != null) {
            this.actOfWorks.forEach(i -> i.setMaster(null));
        }
        if (actOfWorks != null) {
            actOfWorks.forEach(i -> i.setMaster(this));
        }
        this.actOfWorks = actOfWorks;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Master)) {
            return false;
        }
        return id != null && id.equals(((Master) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Master{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
