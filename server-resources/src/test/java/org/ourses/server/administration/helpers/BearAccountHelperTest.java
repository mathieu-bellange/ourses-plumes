package org.ourses.server.administration.helpers;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class BearAccountHelperTest {

    private final BearAccountHelper helper = new BearAccountHelperImpl();

    @Test
    public void shouldValidPassword() {
        assertThat(helper.isPasswordValid("azer77azaety")).isTrue();
        assertThat(helper.isPasswordValid("azertyu")).isFalse();
        assertThat(helper.isPasswordValid("1245789")).isFalse();
        assertThat(helper.isPasswordValid("aze7")).isFalse();
        assertThat(helper.isPasswordValid("")).isFalse();
        assertThat(helper.isPasswordValid(null)).isFalse();
    }

    @Test
    public void shouldValidPseudo() {
        assertThat(helper.isPseudoValid("azerty")).isTrue();
        assertThat(helper.isPseudoValid("")).isFalse();
        assertThat(helper.isPseudoValid(null)).isFalse();
    }

}
