package org.ourses.server.external.helpers;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;
import org.ourses.server.external.domain.dto.BitlyUrl;

public class BitlyTest {

    @Test
    @Ignore
    public void shouldShortenedUrl()  {
        BitlyHelperImpl bitlyHelper = new BitlyHelperImpl();
        BitlyUrl bitlyUrl = bitlyHelper.shortenUrl("http://www.lesoursesaplumes.com/");
        assertThat(bitlyUrl.getStatusCode()).isEqualTo(200);
        assertThat(bitlyUrl.getData().getUrl()).isNotNull();
    }
}
