package org.ourses.server.authentication.helpers;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class BearAccountHelperTest {

    private final BearAccountHelper helper = new BearAccountHelperImpl();

    @Test
    public void shouldValidMail() {
        assertThat(helper.isMailValid("mbellange@gmail.com")).isTrue();
        assertThat(helper.isMailValid("@gmail.com")).isFalse();
        assertThat(helper.isMailValid("mbellange@")).isFalse();
        assertThat(helper.isMailValid("m")).isFalse();
    }

}
