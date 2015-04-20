package org.ourses.server.external.helpers;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.server.external.domain.dto.BitlyUrl;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.UniformInterfaceException;

public class BitlyTest {

    @Test
    public void shouldShortenedUrl() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        BitlyHelperImpl bitlyHelper = new BitlyHelperImpl();
        BitlyUrl bitlyUrl = bitlyHelper.shortenUrl("http://www.lesoursesaplumes.com/");
        assertThat(bitlyUrl.getStatusCode()).isEqualTo(200);
        assertThat(bitlyUrl.getData().getUrl()).isNotNull();
    }
}
