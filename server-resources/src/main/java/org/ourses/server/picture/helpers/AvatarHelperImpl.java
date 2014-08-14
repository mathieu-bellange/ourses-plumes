package org.ourses.server.picture.helpers;

import org.ourses.server.picture.domain.entities.Avatar;
import org.springframework.stereotype.Component;

@Component
public class AvatarHelperImpl implements AvatarHelper {

    @Override
    public byte[] findAvatar(Long id) {
        byte[] img = null;
        Avatar avatar = Avatar.findAvatar(id);
        if (avatar != null) {
            img = avatar.getImage();
        }
        return img;
    }

}
