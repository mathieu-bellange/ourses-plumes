package org.ourses.server.resources;

import java.util.List;

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

import org.ourses.server.authentication.helpers.BearAccountHelper;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.entities.administration.OursesAuthorizationInfo;
import org.ourses.server.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.domain.exception.AccountProfileNullException;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.administration.OursesAuthzInfoDTO;
import org.ourses.server.resources.util.HTTPUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

@Controller
@Path("/account")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BearAccountResources {

    @Autowired
    private BearAccountHelper helper;

    @PUT
    @Path("/create")
    public Response createAccount(BearAccountDTO bearAccountDTO) {
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        String pseudo = null;
        if (bearAccountDTO.getProfile() != null) {
            pseudo = bearAccountDTO.getProfile().getPseudo();
        }
        try {
            // test si login/mail/password ok
            if (helper.isNewMail(bearAccountDTO.getMail()) && helper.isMailValid(bearAccountDTO.getMail())
                    && helper.isPseudoValid(pseudo) && helper.isNewPseudo(pseudo)
                    && helper.isPasswordValid(bearAccountDTO.getPassword())) {
                // on créé par défaut un compte en rédactrice
                BearAccount account = bearAccountDTO.toBearAccount();
                account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));

                account.save();
                responseBuilder = responseBuilder.entity(account.toBearAccountDTO());
            }
            else {
                responseBuilder = Response.status(Status.FORBIDDEN);
            }
        }
        catch (AccountProfileNullException | AccountAuthcInfoNullException | AccountAuthzInfoNullException e) {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR).header(HTTPUtility.HEADER_ERROR,
                    e.getClass().getSimpleName());
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/update")
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

    @PUT
    @Path("/{id}/role")
    public Response updateAccount(@PathParam("id")
    long id, OursesAuthzInfoDTO role) {
        BearAccount bearAccount = BearAccount.find(id);
        bearAccount.setAuthzInfo(role.toOursesAuthorizationInfo());
        bearAccount.update(Sets.newHashSet("authzInfo"));
        return Response.status(Status.NO_CONTENT).build();
    }

    @GET
    @Path("/{id}")
    public Response getAccount(@PathParam("id")
    long id) {
        BearAccount bearAccount = BearAccount.find(id);
        ResponseBuilder builder;
        if (bearAccount == null) {
            builder = Response.serverError();
        }
        else {
            builder = Response.ok().entity(bearAccount.toBearAccountDTO());
        }
        return builder.build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteAccount(@PathParam("id")
    long id) {
        BearAccount bearAccount = new BearAccount();
        bearAccount.setId(id);
        bearAccount.delete();
        return Response.status(Status.NO_CONTENT).build();
    }

    @GET
    public Response findAllBearAccounts() {
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
        return Response.ok().entity(listBearAccountDTO).build();
    }
}
