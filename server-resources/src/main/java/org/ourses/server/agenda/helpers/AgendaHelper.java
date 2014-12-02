package org.ourses.server.agenda.helpers;

import java.util.Set;

import org.ourses.server.agenda.domain.dto.CalendarDayDTO;

public interface AgendaHelper {

    Set<CalendarDayDTO> findCalendarDays();

}
