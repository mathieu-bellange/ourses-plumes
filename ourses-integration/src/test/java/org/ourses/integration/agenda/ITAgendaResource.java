package org.ourses.integration.agenda;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;
import java.util.Collection;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.agenda.domain.dto.CalendarDayDTO;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;

public class ITAgendaResource {

    private static final String PATH_GET_CALENDAR_DAYS = "/rest/agenda";
    private static final String PATH_PUT_NEW_EVENT = "/rest/agenda/25-12-2014/create";
    private static final String PATH_PUT_WRONG_DAY = "/rest/agenda/77777/create";

    Logger logger = LoggerFactory.getLogger(ITAgendaResource.class);

    @Test
    public void shouldCalendarDays() {
        URI uri = UriBuilder.fromPath(PATH_GET_CALENDAR_DAYS).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<Collection<CalendarDayDTO>> gt = new GenericType<Collection<CalendarDayDTO>>() {
        };
        Collection<CalendarDayDTO> maps = clientResponse.getEntity(gt);
        assertThat(maps).hasSize(5);
    }

    @Test
    public void shouldNotCreateEventOnWrongDate() {
        URI uri = UriBuilder.fromPath(PATH_PUT_WRONG_DAY).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(500);
    }

    @Test
    public void shouldCreateEvent() {
        URI uri = UriBuilder.fromPath(PATH_PUT_NEW_EVENT).build();
        CalendarEventDTO event = new CalendarEventDTO();
        event.setTitle("Title");
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, event);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        CalendarEventDTO eventDTO = clientResponse.getEntity(CalendarEventDTO.class);
        assertThat(eventDTO.getId()).isNotNull();
        assertThat(eventDTO.getTitle()).isEqualTo("Title");
    }
}
