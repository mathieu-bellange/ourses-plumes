package org.ourses.server.redaction.helpers;

import java.util.Collection;

import org.ourses.server.redaction.domain.dto.FolderDTO;
import org.ourses.server.redaction.domain.entities.Folder;
import org.springframework.stereotype.Component;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;

@Component
public class FolderHelperImpl implements FolderHelper {

    @Override
    public Collection<FolderDTO> findAllFolder() {
        return Collections2.transform(Folder.findAllFolder(), new Function<Folder, FolderDTO>() {

            @Override
            public FolderDTO apply(final Folder input) {
                return input.toFolderDTO();
            }
        });
    }
}
