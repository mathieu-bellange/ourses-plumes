package org.ourses.server.agenda.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.agenda.helpers.AgendaHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/agenda")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AgendaResource {

    @Autowired
    private AgendaHelper agendaHelper;

    @GET
    public Response getCalendarDays() {
        return Response.ok().entity(agendaHelper.findCalendarDays()).build();
    }
}
