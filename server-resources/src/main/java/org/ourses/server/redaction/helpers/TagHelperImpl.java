package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.stereotype.Service;

import com.avaje.ebean.Ebean;

@Service
public class TagHelperImpl implements TagHelper {

    @Override
    public Set<Tag> findAllTag() {
        return Ebean.find(Tag.class).findSet();
    }

}
