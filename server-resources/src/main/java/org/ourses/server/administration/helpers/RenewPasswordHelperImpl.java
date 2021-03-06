package org.ourses.server.administration.helpers;

import org.apache.http.client.utils.URIBuilder;
import org.apache.shiro.authc.credential.DefaultPasswordService;
import org.apache.shiro.crypto.hash.DefaultHashService;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.util.SimpleByteSource;
import org.ourses.server.util.EnvironnementVariable;
import org.springframework.stereotype.Component;

@Component
public class RenewPasswordHelperImpl implements RenewPasswordHelper {

    private static final String URL_RENEW_SCHEME = "https";
    private static final String URL_RENEW_PATH = "/parametres/compte/renouvellement";
    private static final String URL_RENEW_PARAM = "id";
    DefaultHashService hashService = new DefaultHashService();
    DefaultPasswordService passwordService = new DefaultPasswordService();

    public RenewPasswordHelperImpl() {
        hashService.setHashIterations(200000);
        hashService.setHashAlgorithmName(Sha256Hash.ALGORITHM_NAME);
        hashService.setPrivateSalt(new SimpleByteSource(EnvironnementVariable.SHA_SALT));
        hashService.setGeneratePublicSalt(true);
        passwordService.setHashService(hashService);
    }

    @Override
    public String generateUrlToRenewPassword(final String mail, final String expiredDate) {
        String id = generateRenewPasswordId(mail, expiredDate);
        return generateUrl(id);
    }

    protected String generateRenewPasswordId(final String mail, final String date) {
        return passwordService.encryptPassword(mail + date);
    }

    private String generateUrl(final String id) {
        URIBuilder uriBuilder = new URIBuilder();
        uriBuilder.setScheme(URL_RENEW_SCHEME);
        uriBuilder.setHost(EnvironnementVariable.DOMAIN_NAME);
        uriBuilder.setPath(URL_RENEW_PATH);
        uriBuilder.setParameter(URL_RENEW_PARAM, id);
        return uriBuilder.toString();
    }

    @Override
    public boolean isRenewPasswordIdMatch(final String id, final String mail, final String date) {
        return passwordService.passwordsMatch(mail + date, id);
    }
}
