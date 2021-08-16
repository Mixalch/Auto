package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActOfWorksTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActOfWorks.class);
        ActOfWorks actOfWorks1 = new ActOfWorks();
        actOfWorks1.setId(1L);
        ActOfWorks actOfWorks2 = new ActOfWorks();
        actOfWorks2.setId(actOfWorks1.getId());
        assertThat(actOfWorks1).isEqualTo(actOfWorks2);
        actOfWorks2.setId(2L);
        assertThat(actOfWorks1).isNotEqualTo(actOfWorks2);
        actOfWorks1.setId(null);
        assertThat(actOfWorks1).isNotEqualTo(actOfWorks2);
    }
}
