package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClientCarTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientCar.class);
        ClientCar clientCar1 = new ClientCar();
        clientCar1.setId(1L);
        ClientCar clientCar2 = new ClientCar();
        clientCar2.setId(clientCar1.getId());
        assertThat(clientCar1).isEqualTo(clientCar2);
        clientCar2.setId(2L);
        assertThat(clientCar1).isNotEqualTo(clientCar2);
        clientCar1.setId(null);
        assertThat(clientCar1).isNotEqualTo(clientCar2);
    }
}
