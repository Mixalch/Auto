package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ClientCar.
 */
@Entity
@Table(name = "client_car")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ClientCar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "brande")
    private String brande;

    @Column(name = "win")
    private String win;

    @Column(name = "date_receiving")
    private LocalDate dateReceiving;

    /**
     * A relationship
     */
    @ApiModelProperty(value = "A relationship")
    @OneToMany(mappedBy = "clientCar")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "clientCar", "master" }, allowSetters = true)
    private Set<ActOfWorks> actOfWorks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "clientCars" }, allowSetters = true)
    private CarBrand carBrand;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClientCar id(Long id) {
        this.id = id;
        return this;
    }

    public String getBrande() {
        return this.brande;
    }

    public ClientCar brande(String brande) {
        this.brande = brande;
        return this;
    }

    public void setBrande(String brande) {
        this.brande = brande;
    }

    public String getWin() {
        return this.win;
    }

    public ClientCar win(String win) {
        this.win = win;
        return this;
    }

    public void setWin(String win) {
        this.win = win;
    }

    public LocalDate getDateReceiving() {
        return this.dateReceiving;
    }

    public ClientCar dateReceiving(LocalDate dateReceiving) {
        this.dateReceiving = dateReceiving;
        return this;
    }

    public void setDateReceiving(LocalDate dateReceiving) {
        this.dateReceiving = dateReceiving;
    }

    public Set<ActOfWorks> getActOfWorks() {
        return this.actOfWorks;
    }

    public ClientCar actOfWorks(Set<ActOfWorks> actOfWorks) {
        this.setActOfWorks(actOfWorks);
        return this;
    }

    public ClientCar addActOfWorks(ActOfWorks actOfWorks) {
        this.actOfWorks.add(actOfWorks);
        actOfWorks.setClientCar(this);
        return this;
    }

    public ClientCar removeActOfWorks(ActOfWorks actOfWorks) {
        this.actOfWorks.remove(actOfWorks);
        actOfWorks.setClientCar(null);
        return this;
    }

    public void setActOfWorks(Set<ActOfWorks> actOfWorks) {
        if (this.actOfWorks != null) {
            this.actOfWorks.forEach(i -> i.setClientCar(null));
        }
        if (actOfWorks != null) {
            actOfWorks.forEach(i -> i.setClientCar(this));
        }
        this.actOfWorks = actOfWorks;
    }

    public CarBrand getCarBrand() {
        return this.carBrand;
    }

    public ClientCar carBrand(CarBrand carBrand) {
        this.setCarBrand(carBrand);
        return this;
    }

    public void setCarBrand(CarBrand carBrand) {
        this.carBrand = carBrand;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClientCar)) {
            return false;
        }
        return id != null && id.equals(((ClientCar) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClientCar{" +
            "id=" + getId() +
            ", brande='" + getBrande() + "'" +
            ", win='" + getWin() + "'" +
            ", dateReceiving='" + getDateReceiving() + "'" +
            "}";
    }
}
