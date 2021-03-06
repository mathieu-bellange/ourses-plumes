package org.ourses.server.administration.helpers;

import java.util.Set;

import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.entities.Profile;

public interface ProfileHelper {

    boolean updateProfileProperty(Profile profile, CoupleDTO coupleDTO);

    Profile findProfileByAuthcToken(String token);

    Long findIdProfile(String token);

    void buildProfilePath(Profile profile);

    Profile findPublicProfile(String id);

    String findProfileRole(String pseudoBeautify);

    String beautifyPseudo(String pseudo);

    void addDefaultAvatar(Profile profile);

    Profile deleteAvatar(Long id);

    Set<Profile> findWriterProfiles();

}
