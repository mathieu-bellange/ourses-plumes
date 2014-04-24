package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.redaction.domain.entities.Category;

public interface CategoryHelper {

    Set<Category> findAllCategory();

}
