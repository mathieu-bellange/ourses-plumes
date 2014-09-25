package org.ourses.server.picture.helpers;

import static org.fest.assertions.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.ourses.server.picture.domain.entities.Avatar;

public class AvatarHelperTest {

    AvatarHelperImpl helper = new AvatarHelperImpl();
    @Mock
    File img;
    @Mock
    Avatar avatar;

    public AvatarHelperTest() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldScaleImage() throws IOException {
        BufferedImage bimg = ImageIO.read(new File("src/test/resources/img/exemple.jpg"));
        assertThat(helper.scale(bimg).getWidth()).isEqualTo(384);
        assertThat(helper.scale(bimg).getHeight()).isEqualTo(288);
    }

    @Test
    public void shouldNotScaleImage() throws IOException {
        // quand l'image est trop petite, on y touche pas
        BufferedImage bimg = ImageIO.read(new File("src/test/resources/img/exemple.png"));
        assertThat(helper.scale(bimg).getWidth()).isEqualTo(100);
        assertThat(helper.scale(bimg).getHeight()).isEqualTo(100);
    }

    @Test
    public void shouldCompressedImage() throws IOException {
        File fimg = new File("src/test/resources/img/exemple.jpg");
        BufferedImage bimg = ImageIO.read(fimg);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(helper.compression(bimg), "jpg", baos);
        baos.flush();
        byte[] imageInByte = baos.toByteArray();
        baos.close();
        assertThat(imageInByte.length).isLessThan(Long.valueOf(fimg.length()).intValue());
    }

    @Test
    public void shouldAcceptImg() {
        when(img.length()).thenReturn(150000l);
        assertThat(helper.isOk(img)).isTrue();
    }

    @Test
    public void shouldNotAcceptImg() {
        when(img.length()).thenReturn(204801l);
        assertThat(helper.isOk(img)).isFalse();
    }

    @Test
    public void shouldBuildAvatarPath() {
        when(avatar.getId()).thenReturn(1l);
        helper.buildAvatarPath(avatar);
        verify(avatar).setPath("/rest/avatars/1");
    }
}
