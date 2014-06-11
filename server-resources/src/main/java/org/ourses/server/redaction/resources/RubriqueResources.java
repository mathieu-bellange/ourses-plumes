package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.entities.Rubrique;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;

@Controller
@Path("/rubriques")
public class RubriqueResources {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Set<RubriqueDTO> findAllRubrique() {
        Set<Rubrique> rubriques = Rubrique.findAllRubrique();
        Set<RubriqueDTO> rubriquesDTO = Sets.newHashSet();
        for (Rubrique rubrique : rubriques) {
            rubriquesDTO.add(rubrique.toRubriqueDTO());
        }
        return rubriquesDTO;
    }
}
