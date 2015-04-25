package org.ourses.integration.redaction;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class ITRubriqueResources {

    private static final String PATH_RUBRIQUES = "/rest/rubriques";

    @Test
    public void shouldGetAllTags() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_RUBRIQUES).build();
        WebResource clientResource = TestHelper.webResource(uri);
        GenericType<Set<RubriqueDTO>> gt = new GenericType<Set<RubriqueDTO>>() {
        };
        Set<RubriqueDTO> response = clientResource.header("Content-Type", "application/json").get(gt);
        assertThat(response).isNotEmpty();
        assertThat(response.size()).isEqualTo(6);
    }
}
