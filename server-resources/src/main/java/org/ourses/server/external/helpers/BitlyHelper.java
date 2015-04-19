package org.ourses.server.external.helpers;

import org.ourses.server.external.domain.dto.BitlyUrl;

public interface BitlyHelper {

	BitlyUrl shortenUrl(String longUrl);
}
