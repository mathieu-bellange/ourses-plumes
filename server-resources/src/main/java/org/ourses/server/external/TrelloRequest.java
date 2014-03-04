package org.ourses.server.external;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.ourses.security.trello.TrelloInfoApi;
import org.springframework.stereotype.Service;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.representation.Form;

@Service
public class TrelloRequest {

    public ClientResponse addBacklogCard(Form formulaire) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        Client client = Client.create(cc);
        if (formulaire == null) {
            formulaire = new Form();
        }
        WebResource webResource = client.resource(UriBuilder.fromUri(TrelloInfoApi.ADD_CAR_URL).build());
        return webResource.type(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON_TYPE)
                .post(ClientResponse.class, formulaire);
    }

}
