package org.ourses.integration.redaction;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.core.util.MultivaluedMapImpl;

public class ITArticleResources {

    private static final String PATH_DRAFT_CREATE = "/rest/articles/create";
    private static final String PATH_DRAFT_UPDATE = "/rest/articles/1";
    private static final String PATH_ANOTHER_DRAFT_UPDATE = "/rest/articles/3";
    private static final String PATH_DRAFT_UPDATE_VALIDATE = "/rest/articles/2";
    private static final String PATH_DRAFT_VALIDATE = "/rest/articles/4/validate";
    private static final String PATH_ANOTHER_DRAFT_VALIDATE = "/rest/articles/3/validate";
    private static final String PATH_DRAFT_VALIDATE_VALIDATE = "/rest/articles/2/validate";
    private static final String PATH_VALIDATE_UPDATE = "/rest/articles/5";
    private static final String PATH_VALIDATE_UPDATE_DRAFT = "/rest/articles/1";
    private static final String PATH_VALIDATE_PUBLISH = "/rest/articles/6/publish";
    private static final String PATH_DRAFT_PUBLISH = "/rest/articles/1/publish";
    private static final String PATH_DELETE_DRAFT = "/rest/articles/7";
    private static final String PATH_DELETE_ANOTHER_DRAFT = "/rest/articles/17";
    private static final String PATH_DELETE_INEXISTING_DRAFT = "/rest/articles/666";
    private static final String PATH_DELETE_VALIDATE = "/rest/articles/8";
    private static final String PATH_INVALDIATE = "/rest/articles/9/invalidate";
    private static final String PATH_INVALDIATE_OWN = "/rest/articles/18/invalidate";
    private static final String PATH_INVALDIATE_ANOTHER = "/rest/articles/19/invalidate";
    private static final String PATH_INVALIDATE_DRAFT = "/rest/articles/10/invalidate";
    private static final String PATH_GET_PUBLISH = "/rest/articles/éducation-culture/titre-14";
    private static final String PATH_GET_DRAFT = "/rest/articles/12";
    private static final String PATH_GET_VALIDATE = "/rest/articles/13";
    private static final String PATH_GET_ALL = "/rest/articles";
    private static final String PATH_CHECK_TITLE = "/rest/articles/check/title";
    private static final String PATH_RECALL_PUBLISH = "/rest/articles/11/recall";
    private static final String PATH_RECALL_REDAC_OWN = "/rest/articles/20/recall";
    private static final String PATH_RECALL_ANOTHER = "/rest/articles/21/recall";
    private static final String PATH_RECALL_DRAFT = "/rest/articles/3/recall";

    @Test
    public void shouldUseTitleForNewDraft() {
        URI uri = UriBuilder.fromPath(PATH_CHECK_TITLE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").post(ClientResponse.class, "Un titre pas utilisé");
        // status attendu 204
        assertThat(clientResponse.getStatus()).isEqualTo(204);
    }

    @Test
    public void shouldNotUseTitleForNewDraft() {
        URI uri = UriBuilder.fromPath(PATH_CHECK_TITLE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").post(ClientResponse.class, "titre 12");
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldUseSameTitleForUpdateDraft() {
        URI uri = UriBuilder.fromPath(PATH_CHECK_TITLE).build();
        MultivaluedMap<String, String> params = new MultivaluedMapImpl();
        params.add("id", "12");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRoleAndParams(uri, params)
                .header("Content-Type", "application/json").post(ClientResponse.class, "titre 12");
        // status attendu 204
        assertThat(clientResponse.getStatus()).isEqualTo(204);
    }

    @Test
    public void shouldNotUseTitleForUpdateDraft() {
        URI uri = UriBuilder.fromPath(PATH_CHECK_TITLE).build();
        MultivaluedMap<String, String> params = new MultivaluedMapImpl();
        params.add("id", "13");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRoleAndParams(uri, params)
                .header("Content-Type", "application/json").post(ClientResponse.class, "titre 12");
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldReadAllPublishArticle() {
        URI uri = UriBuilder.fromPath(PATH_GET_ALL).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<List<ArticleDTO>> gt = new GenericType<List<ArticleDTO>>() {
        };
        List<ArticleDTO> articles = clientResponse.getEntity(gt);
        assertThat(articles).onProperty("status").containsOnly(ArticleStatus.ENLIGNE);
    }

    @Test
    public void shouldReadAllPublishArticleAndIsOwnDraftToCheck() {
        URI uri = UriBuilder.fromPath(PATH_GET_ALL).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<List<ArticleDTO>> gt = new GenericType<List<ArticleDTO>>() {
        };
        List<ArticleDTO> articles = clientResponse.getEntity(gt);
        assertThat(articles).onProperty("status").containsOnly(ArticleStatus.ENLIGNE, ArticleStatus.BROUILLON,
                ArticleStatus.AVERIFIER);
        Collection<ArticleDTO> drafts = Collections2.filter(articles, new Predicate<ArticleDTO>() {

            @Override
            public boolean apply(ArticleDTO input) {
                return ArticleStatus.BROUILLON.equals(input.getStatus());
            }
        });
        assertThat(drafts).onProperty("profile.pseudo").containsOnly("jpetit");
        Collection<ArticleDTO> toChecks = Collections2.filter(articles, new Predicate<ArticleDTO>() {

            @Override
            public boolean apply(ArticleDTO input) {
                return ArticleStatus.AVERIFIER.equals(input.getStatus());
            }
        });
        assertThat(toChecks).onProperty("profile.pseudo").containsOnly("jpetit");
    }

    @Test
    public void shouldReadAllPublishArticleAndDraftAndValidate() {
        URI uri = UriBuilder.fromPath(PATH_GET_ALL).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<List<ArticleDTO>> gt = new GenericType<List<ArticleDTO>>() {
        };
        List<ArticleDTO> articles = clientResponse.getEntity(gt);
        assertThat(articles).onProperty("status").containsOnly(ArticleStatus.ENLIGNE, ArticleStatus.BROUILLON,
                ArticleStatus.AVERIFIER);
    }

    @Test
    public void shouldReadPublishArticle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_PUBLISH).build();

        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getId()).isNotNull();
        assertThat(article.getTitle()).isNotNull();
        assertThat(article.getDescription()).isNotNull();
        assertThat(article.getBody()).isNotNull();
        assertThat(article.getCategory().getCategory()).isNotNull();
        assertThat(article.getRubrique().getRubrique()).isNotNull();
        assertThat(article.getProfile().getPseudo()).isNotNull();
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.ENLIGNE);
        assertThat(article.getPath()).isNotNull();
        assertThat(article.getTitleBeautify()).isNotNull();
        assertThat(article.getTags()).isNotEmpty();
    }

    @Test
    public void shouldReadIsOwnDraftArticle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_DRAFT).build();

        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
    }

    @Test
    public void shouldNotReadDraftArticle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_DRAFT).build();

        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .get(ClientResponse.class);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldNotReadDraftArticleAnotherArticle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_DRAFT).build();

        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldReadValidateArticle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_VALIDATE).build();

        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
    }

    @Test
    public void shouldNotReadValidateArticleWithRedacRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_VALIDATE).build();

        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").get(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotReadValidateArticleWithAnon() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_VALIDATE).build();

        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .get(ClientResponse.class);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldCreateArticleWithRedacRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();

        ArticleDTO newArticle = newArticle("shouldCreateArticleWithRedacRole");
        Set<TagDTO> tags = Sets.newHashSet();
        tags.add(new TagDTO(null, "mon tag"));
        tags.add(new TagDTO(1l, "tag en base"));
        newArticle.setTags(tags);
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, newArticle);
        // status attendu 201
        assertThat(clientResponse.getStatus()).isEqualTo(201);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getId()).isNotNull();
        assertThat(article.getTitle()).isEqualTo(newArticle.getTitle());
        assertThat(article.getDescription()).isEqualTo(newArticle.getDescription());
        assertThat(article.getBody()).isEqualTo(newArticle.getBody());
        assertThat(article.getCategory()).isEqualTo(newArticle.getCategory());
        assertThat(article.getRubrique()).isEqualTo(newArticle.getRubrique());
        assertThat(article.getProfile().getPseudo()).isEqualTo("jpetit");
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.BROUILLON);
        assertThat(article.getPath()).isEqualTo("/articles/" + article.getId());
        assertThat(article.getTitleBeautify()).isEqualTo("shouldcreatearticlewithredacrole");
        assertThat(article.getCreatedDate()).isNotNull();
        assertThat(article.getTags()).onProperty("tag").containsOnly("Tag 1", "mon tag");
    }

    @Test
    public void shouldNotCreateArticleWithSameTitle() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();

        ArticleDTO newArticle = newArticle("titre 12");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, newArticle);
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldCreateArticleWithAdminRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();
        ArticleDTO newArticle = newArticle("shouldCreateArticleWithAdminRole");
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, newArticle);
        // status attendu 201
        assertThat(clientResponse.getStatus()).isEqualTo(201);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
    }

    @Test
    public void shouldNotCreateArticleWithoutRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .put(ClientResponse.class, new ArticleDTO());
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldUpdateDraft() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(1l, "titre 1");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getId()).isEqualTo(1l);
        assertThat(article.getTitle()).isEqualTo(updateArticle.getTitle());
        assertThat(article.getDescription()).isEqualTo(updateArticle.getDescription());
        assertThat(article.getBody()).isEqualTo(updateArticle.getBody());
        assertThat(article.getCategory()).isEqualTo(updateArticle.getCategory());
        assertThat(article.getRubrique()).isEqualTo(updateArticle.getRubrique());
        assertThat(article.getProfile().getPseudo()).isEqualTo("jpetit");
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.BROUILLON);
        assertThat(article.getTitleBeautify()).isEqualTo("titre-1");
        assertThat(article.getUpdatedDate()).isNotNull();
    }

    @Test
    public void shouldNotUpdateDraftWithSameTitle() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(1l, "titre 12");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotUpdateDraftToOtherPeople() {
        URI uri = UriBuilder.fromPath(PATH_ANOTHER_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(1l, "shouldNotUpdateDraftToOtherPeople");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotUpdateDraftWithValidateArticle() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE_VALIDATE).build();
        ArticleDTO updateArticle = updateArticle(1l, "shouldNotUpdateDraftWithValidateArticle");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotUpdateArticleWithoutRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .put(ClientResponse.class, new ArticleDTO());
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldValidateDraft() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_VALIDATE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.AVERIFIER);
        assertThat(article.getPath()).isEqualTo("/articles/4");
    }

    @Test
    public void shouldNotValidateDraftToOtherPeople() {
        URI uri = UriBuilder.fromPath(PATH_ANOTHER_DRAFT_VALIDATE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotValidateValidateArticle() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_VALIDATE_VALIDATE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotValidateWithoutRole() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_VALIDATE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldUpdateValidateWithAdminRole() {
        URI uri = UriBuilder.fromPath(PATH_VALIDATE_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(5l, "shouldNotUpdateValidateWithAdminRole");
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
    }

    @Test
    public void shouldNotUpdateValidateWithRedacRole() {
        URI uri = UriBuilder.fromPath(PATH_VALIDATE_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(5l, "shouldNotUpdateValidateWithRedacRole");
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotUpdateDraftWithValidatePath() {
        URI uri = UriBuilder.fromPath(PATH_VALIDATE_UPDATE_DRAFT).build();
        ArticleDTO updateArticle = updateArticle(1l, "shouldNotUpdateDraftWithValidatePath");
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldPublishValidate() {
        URI uri = UriBuilder.fromPath(PATH_VALIDATE_PUBLISH).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.ENLIGNE);
        assertThat(article.getPath()).isEqualTo(
                "/articles/" + article.getRubrique().getRubrique().toLowerCase() + "/titre-6");
        assertThat(article.getTitleBeautify()).isEqualTo("titre-6");
    }

    @Test
    public void shouldNotPublishWithRedacRole() {
        URI uri = UriBuilder.fromPath(PATH_VALIDATE_PUBLISH).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotPublishDraft() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_PUBLISH).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldDeleteDraft() {
        URI uri = UriBuilder.fromPath(PATH_DELETE_DRAFT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").delete(ClientResponse.class);
        // status attendu 204
        assertThat(clientResponse.getStatus()).isEqualTo(204);
    }

    @Test
    public void shouldNotDeleteInexistingDraft() {
        URI uri = UriBuilder.fromPath(PATH_DELETE_INEXISTING_DRAFT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").delete(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldDeleteDraftByAnotherUser() {
        URI uri = UriBuilder.fromPath(PATH_DELETE_ANOTHER_DRAFT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").delete(ClientResponse.class);
        // status attendu 204
        assertThat(clientResponse.getStatus()).isEqualTo(204);
    }

    @Test
    public void shouldNotDeleteValidate() {
        URI uri = UriBuilder.fromPath(PATH_DELETE_VALIDATE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").delete(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldInvalidate() {
        URI uri = UriBuilder.fromPath(PATH_INVALDIATE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.BROUILLON);
    }

    @Test
    public void shouldInvalidateWithRedacRoleIsOwnArticle() {
        URI uri = UriBuilder.fromPath(PATH_INVALDIATE_OWN).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
    }

    @Test
    public void shouldNotInvalidateWithRedacRoleAnotherArticle() {
        URI uri = UriBuilder.fromPath(PATH_INVALDIATE_ANOTHER).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotInvalidateDraft() {
        URI uri = UriBuilder.fromPath(PATH_INVALIDATE_DRAFT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldRecallPublishedArticle() {
        URI uri = UriBuilder.fromPath(PATH_RECALL_PUBLISH).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.AVERIFIER);
        assertThat(article.getPath()).isEqualTo("/articles/" + article.getId());
        assertThat(article.getPublishedDate()).isNull();
    }

    @Test
    public void shouldRecallDraftArticle() {
        URI uri = UriBuilder.fromPath(PATH_RECALL_DRAFT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldRecallByRedacIsOwnArticle() {
        URI uri = UriBuilder.fromPath(PATH_RECALL_REDAC_OWN).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
    }

    @Test
    public void shouldNotRecallByRedacAnotherArticle() {
        URI uri = UriBuilder.fromPath(PATH_RECALL_ANOTHER).build();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 404
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotRecallByAnon() {
        URI uri = UriBuilder.fromPath(PATH_RECALL_PUBLISH).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).type(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).put(ClientResponse.class);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    private ArticleDTO newArticle(String title) {
        ArticleDTO newArticle = new ArticleDTO();
        newArticle.setTitle(title);
        newArticle.setDescription("desc");
        newArticle.setBody("body");
        CategoryDTO cat = new CategoryDTO(2l, "reportage");
        newArticle.setCategory(cat);
        RubriqueDTO rubrique = new RubriqueDTO(1l, "luttes");
        newArticle.setRubrique(rubrique);
        return newArticle;
    }

    private ArticleDTO updateArticle(long id, String title) {
        ArticleDTO newArticle = new ArticleDTO();
        newArticle.setId(id);
        newArticle.setTitle(title);
        newArticle.setDescription("desc 2");
        newArticle.setBody("body 2");
        CategoryDTO cat = new CategoryDTO(3l, "dossier");
        newArticle.setCategory(cat);
        RubriqueDTO rubrique = new RubriqueDTO(2l, "corps");
        newArticle.setRubrique(rubrique);
        return newArticle;
    }
}
