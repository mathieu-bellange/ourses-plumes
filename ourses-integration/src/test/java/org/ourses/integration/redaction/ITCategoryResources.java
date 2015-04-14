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
import org.ourses.server.redaction.domain.dto.CategoryDTO;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class ITCategoryResources {

    private static final String PATH_CATEGORIES = "/rest/categories";

    @Test
    public void shouldGetAllCategories() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_CATEGORIES).build();
        WebResource clientResource = TestHelper.webResource(uri);
        GenericType<Set<CategoryDTO>> gt = new GenericType<Set<CategoryDTO>>() {
        };
        Set<CategoryDTO> response = clientResource.header("Content-Type", "application/json").get(gt);
        assertThat(response).isNotEmpty();
        assertThat(response.size()).isEqualTo(15);
    }

}
