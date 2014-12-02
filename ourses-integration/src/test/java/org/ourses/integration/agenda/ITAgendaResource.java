package org.ourses.integration.agenda;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;

public class ITAgendaResource {

    private static final String PATH_GET_CALENDAR_DAYS = "/rest/agenda";

    Logger logger = LoggerFactory.getLogger(ITAgendaResource.class);

    @Test
    public void shouldCalendarDays() {
        URI uri = UriBuilder.fromPath(PATH_GET_CALENDAR_DAYS).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        // logger.debug("json {}", clientResponse.getEntity(String.class));
        GenericType<Map<Date, Collection<CalendarEventDTO>>> gt = new GenericType<Map<Date, Collection<CalendarEventDTO>>>() {
        };
        Map<Date, Collection<CalendarEventDTO>> maps = clientResponse.getEntity(gt);
        assertThat(maps).hasSize(4);
    }
}
