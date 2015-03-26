package org.ourses.server.agenda.domain.entities;

import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.agenda.domain.dto.CalendarEventDTO;
import org.springframework.beans.BeanUtils;

import com.avaje.ebean.Ebean;

@Entity
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "calendar_event_seq_gen")
    @SequenceGenerator(name = "calendar_event_seq_gen", sequenceName = "calendar_event_seq")
    private Long id;
    @Temporal(TemporalType.DATE)
    private Date eventDate;
    private String title;
    @Column(name="description")
    private String desc;

    public String getDesc() {
        return desc;
    }

    public void setDesc(final String description) {
        this.desc = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(final Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public static Set<CalendarEvent> findCalendarEvents() {
        return Ebean.find(CalendarEvent.class).findSet();
    }

    public static Set<CalendarEvent> findCalendarEvents(final Date day) {
        return Ebean.find(CalendarEvent.class).where().eq("eventDate", day).findSet();
    }

    public static CalendarEvent find(final Long id) {
        return Ebean.find(CalendarEvent.class, id);
    }

    public void save() {
        Ebean.save(this);
    }

    public CalendarEventDTO toCalendarEventDTO() {
        CalendarEventDTO calendarEventDTO = new CalendarEventDTO();
        BeanUtils.copyProperties(this, calendarEventDTO);
        return calendarEventDTO;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    public void delete() {
        Ebean.delete(this);
    }

}
