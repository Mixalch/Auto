package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ActOfWorks.
 */
@Entity
@Table(name = "act_of_works")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ActOfWorks implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "win")
    private String win;

    @Column(name = "problev")
    private String problev;

    /**
     * Another side of the same relationship
     */
    @ApiModelProperty(value = "Another side of the same relationship")
    @ManyToOne
    @JsonIgnoreProperties(value = { "actOfWorks", "carBrand" }, allowSetters = true)
    private ClientCar clientCar;

    @ManyToOne
    @JsonIgnoreProperties(value = { "actOfWorks" }, allowSetters = true)
    private Master master;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ActOfWorks id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public ActOfWorks name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWin() {
        return this.win;
    }

    public ActOfWorks win(String win) {
        this.win = win;
        return this;
    }

    public void setWin(String win) {
        this.win = win;
    }

    public String getProblev() {
        return this.problev;
    }

    public ActOfWorks problev(String problev) {
        this.problev = problev;
        return this;
    }

    public void setProblev(String problev) {
        this.problev = problev;
    }

    public ClientCar getClientCar() {
        return this.clientCar;
    }

    public ActOfWorks clientCar(ClientCar clientCar) {
        this.setClientCar(clientCar);
        return this;
    }

    public void setClientCar(ClientCar clientCar) {
        this.clientCar = clientCar;
    }

    public Master getMaster() {
        return this.master;
    }

    public ActOfWorks master(Master master) {
        this.setMaster(master);
        return this;
    }

    public void setMaster(Master master) {
        this.master = master;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActOfWorks)) {
            return false;
        }
        return id != null && id.equals(((ActOfWorks) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActOfWorks{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", win='" + getWin() + "'" +
            ", problev='" + getProblev() + "'" +
            "}";
    }
}
