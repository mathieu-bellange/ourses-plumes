package org.ourses.server.indexation.domain.dto;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;

@XmlEnum
public enum SitemapChangeFreq {

    @XmlEnumValue("always")
    ALWAYS, @XmlEnumValue("hourly")
    HOURLY, @XmlEnumValue("daily")
    DAILY, @XmlEnumValue("weekly")
    WEEKLY, @XmlEnumValue("monthly")
    MONTHLY, @XmlEnumValue("yearly")
    YEARLY, @XmlEnumValue("never")
    NEVER;
}
