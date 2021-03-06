package org.ourses.server.agenda.domain.dto;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.agenda.domain.entities.CalendarEvent;
import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CalendarEventDTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -3748061448697176813L;

    private String title;
    private String desc;

    public String getDesc() {
        return desc;
    }

    public void setDesc(final String description) {
        this.desc = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public CalendarEvent toCalendarEvent() {
        CalendarEvent event = new CalendarEvent();
        BeanUtils.copyProperties(this, event);
        return event;

    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
