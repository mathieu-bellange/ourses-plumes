package org.ourses.server.redaction.helpers;

import java.util.Collection;

import org.ourses.server.redaction.domain.dto.FolderDTO;

public interface FolderHelper {

    Collection<FolderDTO> findAllFolder();

    boolean isNameAlreadyTaken(String name, Long id);
}
