package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.domain.entities.redaction.Category;

public interface CategoryHelper {

    Set<Category> findAllCategory();

}
