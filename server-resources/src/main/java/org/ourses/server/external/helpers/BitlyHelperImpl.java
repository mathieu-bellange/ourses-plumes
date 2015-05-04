package org.ourses.server.external.helpers;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.ourses.server.external.domain.dto.BitlyUrl;
import org.ourses.server.util.EnvironnementVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

@Service
public class BitlyHelperImpl implements BitlyHelper {

    private static final String SHORTENER_URL = "https://api-ssl.bitly.com/v3/shorten";

    Logger logger = LoggerFactory.getLogger(BitlyHelperImpl.class);

//    private ClientResponse doShortenUrl(final String longUrl) {
//        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
//        Client client = Client.create(cc);
//        // Basic authentication
//        WebResource webResource = client.resource(UriBuilder.fromUri(SHORTENER_URL).build())
//                .queryParam("access_token", EnvironnementVariable.BITLY_ACCESS_TOKEN).queryParam("longUrl", longUrl);
//        return webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON)
//                .get(ClientResponse.class);
//
//    }

    @Override
    public BitlyUrl shortenUrl(final String longUrl) {
        BitlyUrl url = new BitlyUrl();
        // try{
        // ClientResponse bitlyResponse = doShortenUrl(longUrl);
        // url = bitlyResponse.getEntity(BitlyUrl.class);
        // }catch(Exception e){
        // logger.error("Erreur lors du shorten", e);
        // url.setStatusCode(Status.INTERNAL_SERVER_ERROR.getStatusCode());
        // }
        return url;
    }
}
