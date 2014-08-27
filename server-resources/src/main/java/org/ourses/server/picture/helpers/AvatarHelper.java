package org.ourses.server.picture.helpers;

import java.io.File;
import java.io.IOException;

import org.ourses.server.picture.domain.entities.Avatar;

public interface AvatarHelper {

    byte[] findAvatar(Long id);

    boolean isOk(File img);

    Avatar save(File img) throws IOException;

}
