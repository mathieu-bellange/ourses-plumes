package org.ourses.server.authentication.helpers;

import org.ourses.server.domain.entities.security.OurseAuthcToken;

public interface OursesAuthenticationHelper {

    OurseAuthcToken findByToken(String token);
}
