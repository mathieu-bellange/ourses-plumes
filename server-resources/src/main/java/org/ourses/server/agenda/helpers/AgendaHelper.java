package org.ourses.server.agenda.helpers;

import java.util.Set;

import org.ourses.server.agenda.domain.dto.CalendarDayDTO;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;

public interface AgendaHelper {

    Set<CalendarDayDTO> findCalendarDays();

    CalendarDayDTO createEventOnOneDay(long calendarDay, Set<CalendarEventDTO> eventDTO);

}