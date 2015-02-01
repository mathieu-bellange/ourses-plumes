package org.ourses.integration.faq;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;
import java.util.List;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.faq.domain.dto.FreqAskedQuestionDTO;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;

public class ITFreqAskedQuestionResources {

	private static final String PATH_LIST_FAQ= "/rest/faq";
	
	@Test
	public void shouldListFaq(){
		URI uri = UriBuilder.fromPath(PATH_LIST_FAQ).build();
		ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .get(ClientResponse.class);
		assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<List<FreqAskedQuestionDTO>> gt = new GenericType<List<FreqAskedQuestionDTO>>() {
        };
        List<FreqAskedQuestionDTO> faq = clientResponse.getEntity(gt);
        assertThat(faq).onProperty("question").excludes((FreqAskedQuestionDTO)null);
        assertThat(faq).onProperty("answer").excludes((FreqAskedQuestionDTO)null);
	}
}
