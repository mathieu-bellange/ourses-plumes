package org.ourses.server.administration.resources;

import java.util.List;

import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.administration.domain.dto.BearAccountDTO;
import org.ourses.server.administration.domain.dto.MergeBearAccountDTO;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;
import org.ourses.server.administration.helpers.BearAccountHelper;
import org.ourses.server.security.helpers.SecurityHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.common.net.HttpHeaders;

@Controller
@Path("/account")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BearAccountResources {

    @Autowired
    private BearAccountHelper helper;
    @Autowired
    private SecurityHelper securityHelper;

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
                BearAccount account = helper.create(bearAccountDTO.toBearAccount());
                responseBuilder = responseBuilder.entity(account.toBearAccountDTO());
            }
            else {
                responseBuilder = Response.status(Status.FORBIDDEN);
            }
        }
        catch (AccountProfileNullException | AccountAuthcInfoNullException | AccountAuthzInfoNullException e) {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}")
    public Response updateAccount(@PathParam("id")
    Long id, MergeBearAccountDTO mergeBearAccountDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder builder = null;
        try {
            BearAccount bearAccount = BearAccount.findAdminAccount(id);
            // vérification que le compte a modifié est bien réalisé par l'utilisateur authentifié
            securityHelper.checkAuthenticatedUser(bearAccount.getAuthcInfo().getMail(), token);
            // vérification que le mdp est correct
            securityHelper.doCredentialsMatch(bearAccount.getAuthcInfo().getMail(),
                    mergeBearAccountDTO.getOldPassword());
            // vérifie que le path est le bon
            // vérification que le nouveau mdp respect la sécurité demandé
            // vérification que le password confirm est bien le même que le new
            if (helper.isPasswordValid(mergeBearAccountDTO.getNewPassword())
                    && mergeBearAccountDTO.getConfirmPassword().equals(mergeBearAccountDTO.getNewPassword())) {
                // encrypte le password avant de le sauver
                bearAccount.setCredentials(securityHelper.encryptedPassword(mergeBearAccountDTO.getNewPassword()));
                bearAccount.updateCredentials();
                builder = Response.status(Status.NO_CONTENT);
            }
            else {
                builder = Response.status(Status.CONFLICT);
            }

        }
        catch (AuthenticationException ae) {
            builder = Response.status(Status.UNAUTHORIZED);
        }
        return builder.build();
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
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        BearAccount bearAccount = BearAccount.findAdminAccount(id);

        ResponseBuilder builder;
        if (bearAccount == null) {
            builder = Response.serverError();
        }
        else {
            try {
                // vérification que le compte a récupéré est bien réalisé par l'utilisateur authentifié
                securityHelper.checkAuthenticatedUser(bearAccount.getAuthcInfo().getMail(), token);

                builder = Response.ok().entity(bearAccount.toBearAccountDTO());
            }
            catch (AuthenticationException ae) {
                builder = Response.status(Status.UNAUTHORIZED);
            }
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
