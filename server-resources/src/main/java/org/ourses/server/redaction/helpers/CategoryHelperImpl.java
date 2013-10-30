package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.domain.entities.redaction.Category;
import org.springframework.stereotype.Service;

import com.avaje.ebean.Ebean;

@Service
public class CategoryHelperImpl implements CategoryHelper {

    @Override
    public Set<Category> findAllCategory() {
        return Ebean.find(Category.class).findSet();
    }

}
