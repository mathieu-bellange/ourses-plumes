package org.ourses.server.agenda.resources;

import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.agenda.domain.dto.CalendarEventDTO;
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
        // cache = 1 day
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(86400);
        return Response.ok().entity(agendaHelper.findCalendarDays()).cacheControl(cacheControl).build();
    }

    @PUT
    @Path("/{calendarDay}")
    public Response createEventOnOneDay(@PathParam("calendarDay")
    final long calendarDay, final Set<CalendarEventDTO> events) {
        ResponseBuilder builder;
        try {
            builder = Response.ok().entity(agendaHelper.createEventOnOneDay(calendarDay, events));
        }
        catch (IllegalArgumentException e) {
            builder = Response.serverError();
        }
        return builder.build();
    }
}
