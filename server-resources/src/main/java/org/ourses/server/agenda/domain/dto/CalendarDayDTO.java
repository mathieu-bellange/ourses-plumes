package org.ourses.server.agenda.domain.dto;

import java.util.Collection;
import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.google.common.collect.Sets;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CalendarDayDTO {

    private Date day;
    private Collection<CalendarEventDTO> events = Sets.newHashSet();

    public CalendarDayDTO() {

    }

    public CalendarDayDTO(Date day, Collection<CalendarEventDTO> events) {
        this.day = day;
        this.events = events;
    }

    public Date getDay() {
        return day;
    }

    public void setDay(Date day) {
        this.day = day;
    }

    public Collection<CalendarEventDTO> getEvents() {
        return events;
    }

    public void setEvents(Collection<CalendarEventDTO> events) {
        this.events = events;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
