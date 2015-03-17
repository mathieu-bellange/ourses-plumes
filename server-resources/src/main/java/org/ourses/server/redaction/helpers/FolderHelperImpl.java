package org.ourses.server.redaction.helpers;

import java.util.Collection;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrBuilder;
import org.ourses.server.redaction.domain.dto.FolderDTO;
import org.ourses.server.redaction.domain.entities.Folder;
import org.springframework.stereotype.Component;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;

@Component
public class FolderHelperImpl implements FolderHelper {

    private static final String URL_SEPARATOR = "-";

    @Override
    public Collection<FolderDTO> findAllFolder() {
        return Collections2.transform(Folder.findAllFolder(), new Function<Folder, FolderDTO>() {

            @Override
            public FolderDTO apply(final Folder input) {
                return input.toFolderDTO();
            }
        });
    }

    @Override
    public boolean isNameAlreadyTaken(final String name, final Long id) {
        return Folder.folderWithSameHash(beautifyName(name), id) > 0;
    }

    protected String beautifyName(final String name) {
        StrBuilder path = new StrBuilder();
        String[] tokens = StringUtils.stripAccents(name).split("\\W");
        for (String token : tokens) {
            if (!token.isEmpty()) {
                path.appendSeparator(URL_SEPARATOR);
                path.append(token.toLowerCase());
            }
        }
        return path.toString();

    }

    @Override
    public FolderDTO createFolder(final FolderDTO folderDTO) {
        Folder newFolder = folderDTO.toFolder();
        newFolder.setHash(beautifyName(newFolder.getName()));
        newFolder.save();
        return newFolder.toFolderDTO();
    }
}
