package org.ourses.server.agenda.helpers;

import java.util.Set;

import org.ourses.server.agenda.domain.dto.CalendarDayDTO;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;

public interface AgendaHelper {

    Set<CalendarDayDTO> findCalendarDays();

    CalendarEventDTO createEventOnOneDay(String calendarDay, CalendarEventDTO eventDTO);

}