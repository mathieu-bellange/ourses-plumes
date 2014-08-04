package org.ourses.server.administration.helpers;

import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Iterator;

import org.apache.commons.lang3.text.StrBuilder;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.domain.entities.SocialLink;
import org.ourses.server.administration.util.SocialLinkUtil;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;

@Component
public class ProfileHelperImpl implements ProfileHelper {

    Logger logger = LoggerFactory.getLogger(ProfileHelperImpl.class);

    @Autowired
    private SecurityHelper securityHelper;

    private final String URL_SEPARATOR = "-";

    @Override
    public boolean updateProfileProperty(Profile profile, CoupleDTO coupleDTO) {

        boolean updated = false;
        try {
            // social link
            if (SocialLinkUtil.NETWORK.contains(coupleDTO.getProperty())) {
                Iterator<SocialLink> links = profile.getSocialLinks().iterator();
                boolean majLinks = false;
                // itère sur la liste des social links
                while (links.hasNext()) {
                    SocialLink link = links.next();
                    // si il existe, il faut update le social link
                    if (link.getNetwork().equals(coupleDTO.getProperty())) {
                        // si la valeur est vide, il faut supprimer le link
                        if (Strings.isNullOrEmpty(coupleDTO.getValue())) {
                            links.remove();
                        }
                        // sinon, il faut l'update
                        else {
                            link.setSocialUser(coupleDTO.getValue());
                        }
                        // indique q'un lien a été maj
                        majLinks = true;
                        break;
                    }
                }
                // si pas update, il faut l'ajouter
                if (!majLinks) {
                    profile.getSocialLinks().add(new SocialLink(null, coupleDTO.getProperty(), coupleDTO.getValue()));
                }
                updated = true;
            }
            else {
                // propriétés du bean profile
                for (PropertyDescriptor property : Introspector.getBeanInfo(Profile.class, Object.class)
                        .getPropertyDescriptors()) {
                    // interdiction de changer l'id
                    if (!property.getName().equals("id") && property.getName().equals(coupleDTO.getProperty())) {
                        Method getter = property.getReadMethod();
                        Object oldValue = getter.invoke(profile);
                        Object newValue = coupleDTO.getValue();
                        if (!oldValue.equals(newValue)) {
                            property.getWriteMethod().invoke(profile, newValue);
                            updated = true;
                            if (property.getName().equals("pseudo")) {
                                buildProfilePath(profile);
                            }
                        }
                    }
                }
            }
        }
        catch (IntrospectionException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
            logger.debug("Introspection error {}", e.getMessage());
        }
        return updated;
    }

    @Override
    public Profile findPublicProfile(String id) {
        Profile profile = null;
        // la recherche est possible soit par l'id long soit par le pseudoBeautify
        try {
            profile = Profile.findProfileWithSocialLinks(Long.parseLong(id));
        }
        catch (NumberFormatException nfe) {
            profile = Profile.findProfileWithSocialLinks(id);
        }
        if (profile != null) {
            for (SocialLink link : profile.getSocialLinks()) {
                SocialLinkUtil.buildDescription(link);
                SocialLinkUtil.buildPath(link);
            }
        }
        return profile;
    }

    @Override
    public Profile findProfileByAuthcToken(String token) {
        Profile profile = null;
        // test si la requête est authentifié
        if (token != null) {
            OurseSecurityToken authcToken = securityHelper.findByToken(token);
            // test si le token est présent en base
            if (authcToken != null) {
                BearAccount account = BearAccount.findAuthcUserProperties(authcToken.getLogin());
                // test si le compt est présent en base
                if (account != null) {
                    profile = account.getProfile();
                }
            }
        }
        return profile;
    }

    @Override
    public Long findIdProfile(String token) {
        Long idProfile = null;
        // le token peut être pour une personne qui se contente de consulter le site
        if (token != null) {
            Profile profile = findProfileByAuthcToken(token);
            // au cas où le token n'est pas lié à un profil
            if (profile != null) {
                idProfile = profile.getId();
            }
        }
        return idProfile;
    }

    @Override
    public String findProfileRole(String pseudoBeautify) {
        BearAccount account = BearAccount.findAccountByPseudo(pseudoBeautify);
        String role = null;
        if (account != null) {
            role = account.getAuthzInfo().getMainRole();
        }
        return role;
    }

    @Override
    public void buildProfilePath(Profile profile) {
        profile.setPseudoBeautify(beautifyPseudo(profile.getPseudo()));
        StringBuilder pathBuilder = new StringBuilder("/profils");
        pathBuilder.append("/");
        pathBuilder.append(profile.getPseudoBeautify());
        profile.setPath(pathBuilder.toString());
    }

    @Override
    public String beautifyPseudo(String pseudo) {
        StrBuilder path = new StrBuilder();
        String[] tokens = pseudo.split("\\W");
        for (String token : tokens) {
            if (!token.isEmpty()) {
                path.appendSeparator(URL_SEPARATOR);
                path.append(token.toLowerCase());
            }
        }
        return path.toString();

    }

}
