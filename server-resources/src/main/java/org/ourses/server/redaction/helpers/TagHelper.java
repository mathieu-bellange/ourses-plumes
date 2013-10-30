package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.domain.entities.redaction.Tag;

public interface TagHelper {

    Set<Tag> findAllTag();

}
