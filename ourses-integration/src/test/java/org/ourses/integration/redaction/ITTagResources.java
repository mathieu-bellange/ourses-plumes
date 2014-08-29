package org.ourses.integration.redaction;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.redaction.domain.dto.TagDTO;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class ITTagResources {

    private static final String PATH_TAGS = "/rest/tags";

    @Test
    public void shouldGetAllTags() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_TAGS).build();
        WebResource clientResource = TestHelper.webResource(uri).queryParam("criteria", "ta");
        GenericType<Set<TagDTO>> gt = new GenericType<Set<TagDTO>>() {
        };
        Set<TagDTO> response = clientResource.header("Content-Type", "application/json").get(gt);
        assertThat(response).isNotEmpty();
        assertThat(response).onProperty("tag").containsOnly("tag 1", "tag 2");
    }
}
