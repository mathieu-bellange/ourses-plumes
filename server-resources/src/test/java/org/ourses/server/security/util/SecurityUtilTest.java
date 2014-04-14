package org.ourses.server.security.util;

import static org.fest.assertions.Assertions.assertThat;

import org.apache.shiro.codec.Base64;
import org.junit.Test;

public class SecurityUtilTest {

    String authorization = "mathieu".concat(":").concat("bellange");
    String basicEncode = Base64.encodeToString(authorization.getBytes());

    @Test
    public void shouldDecodeBasic() {
        assertThat(SecurityUtil.decodeBasicAuthorization(basicEncode)[0]).isEqualTo("mathieu");
        assertThat(SecurityUtil.decodeBasicAuthorization(basicEncode)[1]).isEqualTo("bellange");
    }

    @Test
    public void shouldExtractBasic() {
        assertThat(SecurityUtil.extractBasicAuthorization("Basic " + basicEncode)).isEqualTo(basicEncode);
    }
}
