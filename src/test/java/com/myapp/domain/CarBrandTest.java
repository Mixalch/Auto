package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CarBrandTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CarBrand.class);
        CarBrand carBrand1 = new CarBrand();
        carBrand1.setId(1L);
        CarBrand carBrand2 = new CarBrand();
        carBrand2.setId(carBrand1.getId());
        assertThat(carBrand1).isEqualTo(carBrand2);
        carBrand2.setId(2L);
        assertThat(carBrand1).isNotEqualTo(carBrand2);
        carBrand1.setId(null);
        assertThat(carBrand1).isNotEqualTo(carBrand2);
    }
}
