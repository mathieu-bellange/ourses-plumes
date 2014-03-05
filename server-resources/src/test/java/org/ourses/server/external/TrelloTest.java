package org.ourses.server.external;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.security.trello.TrelloInfoApi;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.representation.Form;

public class TrelloTest {

    private final TrelloRequest request = new TrelloRequest();

    @Test
    public void shouldCreateIssue() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        Form formulaire = new Form();
        formulaire.add(TrelloInfoApi.TOKEN, "fb48c4ee6d41ea0d0bff943874179203901196c74dbe2b0a4c6bee4b5bb4da71");
        formulaire.add(TrelloInfoApi.KEY, TrelloInfoApi.API_KEY);
        formulaire.add(TrelloInfoApi.TITLE, "Titre");
        formulaire.add(TrelloInfoApi.BODY, "Corps");
        formulaire.add(TrelloInfoApi.ID_LIST, TrelloInfoApi.BACKLOG_ID);
        formulaire.add(TrelloInfoApi.DUE, null);
        ClientResponse clientResponse = request.addBacklogCard(formulaire);
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
    }

}
