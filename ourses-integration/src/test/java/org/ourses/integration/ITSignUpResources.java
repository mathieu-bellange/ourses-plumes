package org.ourses.integration;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.ClientResponse.Status;

public class ITSignUpResources {

	private static final String PATH_CHECK_PSEUDO = "/rest/signup_check/pseudo";
	
	@Test
    public void shouldWarnPseudoAlreadyTaken() throws JsonGenerationException, JsonMappingException, UniformInterfaceException, ClientHandlerException, IOException{
    	URI uri = UriBuilder.fromPath(PATH_CHECK_PSEUDO).build();
    	ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json").post(
                 ClientResponse.class, "jpetit");
    	assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }
    
    @Test
    public void shouldGreetNewPseudo() throws JsonGenerationException, JsonMappingException, UniformInterfaceException, ClientHandlerException, IOException{
    	URI uri = UriBuilder.fromPath(PATH_CHECK_PSEUDO).build();
    	ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json").post(
    			ClientResponse.class, "foufy");
    	assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }
}
