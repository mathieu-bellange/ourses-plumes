package org.ourses.server.resources;

import java.util.List;
import java.util.Set;

import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.entities.administration.OursesAuthorizationInfo;
import org.ourses.server.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.domain.exception.AccountProfileNullException;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.util.PatchDto;
import org.ourses.server.resources.util.HTTPUtility;
import org.ourses.server.resources.util.PATCH;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

@Controller
@Path("/account")
public class BearAccountResources {

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    // @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response createAccount(BearAccountDTO bearAccountDTO) {
        // on créé par défaut un compte en rédactrice
        BearAccount account = bearAccountDTO.toBearAccount();
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));
        try {
            account.save();
            responseBuilder = responseBuilder.entity(account.toBearAccountDTO());
        }
        catch (AccountProfileNullException | AccountAuthcInfoNullException | AccountAuthzInfoNullException e) {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR).header(HTTPUtility.HEADER_ERROR,
                    e.getClass().getSimpleName());
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    // @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    // TODO gérer l'update
    public Response updateAccount(BearAccountDTO bearAccountDTO) {
        // on créé par défaut un compte en rédactrice
        BearAccount account = bearAccountDTO.toBearAccount();
        ResponseBuilder responseBuilder = Response.status(Status.NO_CONTENT);
        boolean isNew = account.getId() == null;
        if (isNew) {
            account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));
            responseBuilder = Response.status(Status.CREATED);
        }
        try {
            account.save();
            if (isNew) {
                responseBuilder = responseBuilder.entity(account.toBearAccountDTO());
            }
        }
        catch (AccountProfileNullException | AccountAuthcInfoNullException | AccountAuthzInfoNullException e) {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR).header(HTTPUtility.HEADER_ERROR,
                    e.getClass().getSimpleName());
        }
        return responseBuilder.build();
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateAccount(@PathParam("id")
    long id, Set<PatchDto> setModification) {
        BearAccount bearAccount = BearAccount.find(id);
        bearAccount.update(setModification);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    // @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response deleteAccount(@PathParam("id")
    long id) {
        BearAccount bearAccount = new BearAccount();
        bearAccount.setId(id);
        bearAccount.delete();
        return Response.status(Status.NO_CONTENT).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @RequiresRoles(RolesUtil.ADMINISTRATRICE)
    public List<BearAccountDTO> findAllBearAccounts() {
        List<BearAccount> listBearAccount = BearAccount.findAllAdministrationBearAccounts();
        List<BearAccountDTO> listBearAccountDTO = Lists.transform(listBearAccount,
                new Function<BearAccount, BearAccountDTO>() {

                    @Override
                    @Nullable
                    public BearAccountDTO apply(@Nullable
                    BearAccount bearAccount) {
                        return bearAccount.toBearAccountDTO();
                    }
                });
        return listBearAccountDTO;
    }
}
