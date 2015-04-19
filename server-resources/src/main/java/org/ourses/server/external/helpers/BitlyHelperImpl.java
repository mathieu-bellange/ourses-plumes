package org.ourses.server.external.helpers;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.ourses.server.external.domain.dto.BitlyUrl;
import org.ourses.server.util.EnvironnementVariable;
import org.springframework.stereotype.Service;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

@Service
public class BitlyHelperImpl implements BitlyHelper {
	
	private static final String SHORTENER_URL = "https://api-ssl.bitly.com/v3/shorten";

	private ClientResponse doShortenUrl(String longUrl) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        Client client = Client.create(cc);
        // Basic authentication
        WebResource webResource = client.resource(UriBuilder.fromUri(SHORTENER_URL).build()).queryParam("access_token", EnvironnementVariable.BITLY_ACCESS_TOKEN).queryParam("longUrl", longUrl);
        return webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON)
                .get(ClientResponse.class);

    }

	@Override
	public BitlyUrl shortenUrl(String longUrl) {
		ClientResponse bitlyResponse = doShortenUrl(longUrl);
		BitlyUrl url = bitlyResponse.getEntity(BitlyUrl.class);
		return url;
	}
}
