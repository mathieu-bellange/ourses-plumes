package org.ourses.server.administration.helpers;

import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.entities.Profile;

public interface ProfileHelper {

    boolean updateProfileProperty(Profile profile, CoupleDTO coupleDTO);

}