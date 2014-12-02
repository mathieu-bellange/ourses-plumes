package org.ourses.server.agenda.domain.dto;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.ourses.server.agenda.domain.entities.CalendarEvent;
import org.springframework.beans.BeanUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CalendarEventDTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -3748061448697176813L;

    private Long id;
    private String title;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CalendarEvent toCalendarEvent() {
        CalendarEvent event = new CalendarEvent();
        if (this.id != null) {
            event = CalendarEvent.find(id);
        }
        else {
            BeanUtils.copyProperties(this, event);
        }
        return event;

    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
