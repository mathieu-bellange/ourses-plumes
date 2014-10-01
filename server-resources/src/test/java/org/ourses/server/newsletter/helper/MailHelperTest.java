package org.ourses.server.newsletter.helper;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;

public class MailHelperTest {

    private final MailHelper helper = new MailHelperImpl();

    @Test
    public void shouldValidMail() {
        assertThat(helper.isMailValid("mbellange@gmail.com")).isTrue();
        assertThat(helper.isMailValid("@gmail.com")).isFalse();
        assertThat(helper.isMailValid("mbellange@")).isFalse();
        assertThat(helper.isMailValid("m")).isFalse();
        assertThat(helper.isMailValid("")).isFalse();
        assertThat(helper.isMailValid(null)).isFalse();
    }
}
