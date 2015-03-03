package org.ourses.server.agenda.helpers;

import java.util.Collection;
import java.util.Date;
import java.util.Map.Entry;
import java.util.Set;

import org.ourses.server.agenda.domain.dto.CalendarDayDTO;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;
import org.ourses.server.agenda.domain.entities.CalendarEvent;
import org.springframework.stereotype.Service;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

@Service
public class AgendaHelperImpl implements AgendaHelper {

    @Override
    public Set<CalendarDayDTO> findCalendarDays() {
        Set<CalendarEvent> calendarEvents = CalendarEvent.findCalendarEvents();
        Multimap<Date, CalendarEventDTO> maps = HashMultimap.create();
        for (CalendarEvent calendarEvent : calendarEvents) {
            maps.put(calendarEvent.getEventDate(), calendarEvent.toCalendarEventDTO());
        }
        Set<CalendarDayDTO> days = Sets.newHashSet();
        for (Entry<Date, Collection<CalendarEventDTO>> day : maps.asMap().entrySet()) {
            days.add(new CalendarDayDTO(day.getKey(), day.getValue()));
        }
        return days;
    }

    @Override
    public CalendarDayDTO createEventOnOneDay(final long calendarDay, final Set<CalendarEventDTO> eventsDTO) {
        Date day = new Date(calendarDay);
        Set<CalendarEvent> events = CalendarEvent.findCalendarEvents(day);
        for (CalendarEvent event : events) {
            event.delete();
        }
        for (CalendarEventDTO eventDTO : eventsDTO) {
            CalendarEvent event = eventDTO.toCalendarEvent();
            event.setEventDate(day);
            event.save();
        }
        return new CalendarDayDTO(day, eventsDTO);
    }
}
