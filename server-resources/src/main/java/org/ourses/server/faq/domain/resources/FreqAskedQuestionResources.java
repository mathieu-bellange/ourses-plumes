package org.ourses.server.faq.domain.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.faq.domain.dto.FreqAskedQuestionDTO;
import org.ourses.server.faq.domain.helpers.FreqAskedQuestionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/faq")
@Produces(MediaType.APPLICATION_JSON)
public class FreqAskedQuestionResources {

    @Autowired
    private FreqAskedQuestionHelper freqAskedQuestionHelper;

    @GET
    public List<FreqAskedQuestionDTO> getFaq() {
        return freqAskedQuestionHelper.findAllFaq();
    }

    @PUT
    public Response updateFaq(final List<FreqAskedQuestionDTO> faqs) {
        List<FreqAskedQuestionDTO> faqsDto = freqAskedQuestionHelper.updateFaq(faqs);
        return Response.status(Status.OK).entity(faqsDto).build();
    }

}
