package org.ourses.server.authentication.helpers;

import org.ourses.server.domain.entities.security.OurseAuthcToken;
import org.springframework.stereotype.Component;

@Component
public class OursesAuthenticationHelperImpl implements OursesAuthenticationHelper {

    @Override
    public OurseAuthcToken find(String token) {
        return OurseAuthcToken.find(token);
    }

}
