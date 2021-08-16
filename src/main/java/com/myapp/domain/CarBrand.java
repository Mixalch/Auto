package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CarBrand.
 */
@Entity
@Table(name = "car_brand")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CarBrand implements Serializable, BaseEntity {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "brande")
    private String brande;

    @OneToMany(mappedBy = "carBrand")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "actOfWorks", "carBrand" }, allowSetters = true)
    private Set<ClientCar> clientCars = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CarBrand id(Long id) {
        this.id = id;
        return this;
    }

    public String getBrande() {
        return this.brande;
    }

    public CarBrand brande(String brande) {
        this.brande = brande;
        return this;
    }

    public void setBrande(String brande) {
        this.brande = brande;
    }

    public Set<ClientCar> getClientCars() {
        return this.clientCars;
    }

    public CarBrand clientCars(Set<ClientCar> clientCars) {
        this.setClientCars(clientCars);
        return this;
    }

    public CarBrand addClientCar(ClientCar clientCar) {
        this.clientCars.add(clientCar);
        clientCar.setCarBrand(this);
        return this;
    }

    public CarBrand removeClientCar(ClientCar clientCar) {
        this.clientCars.remove(clientCar);
        clientCar.setCarBrand(null);
        return this;
    }

    public void setClientCars(Set<ClientCar> clientCars) {
        if (this.clientCars != null) {
            this.clientCars.forEach(i -> i.setCarBrand(null));
        }
        if (clientCars != null) {
            clientCars.forEach(i -> i.setCarBrand(this));
        }
        this.clientCars = clientCars;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CarBrand)) {
            return false;
        }
        return id != null && id.equals(((CarBrand) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CarBrand{" +
            "id=" + getId() +
            ", brande='" + getBrande() + "'" +
            "}";
    }
}
