package org.ourses.server.picture.helpers;

import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.ourses.server.picture.domain.entities.Avatar;
import org.springframework.stereotype.Component;

@Component
public class AvatarHelperImpl implements AvatarHelper {

    // taille max 200 KB
    private final static int MAX_WEIGHT = 204800;
    private static final double MAX_WIDTH = 384.0;

    @Override
    public byte[] findAvatar(Long id) {
        byte[] img = null;
        Avatar avatar = Avatar.findAvatar(id);
        if (avatar != null) {
            img = avatar.getImage();
        }
        return img;
    }

    @Override
    public boolean isOk(File img) {
        return img.length() <= MAX_WEIGHT;
    }

    @Override
    public Avatar save(File img) throws IOException {
        Avatar avatar = new Avatar();
        // redimmenssionnement de l'image
        BufferedImage image = scale(ImageIO.read(img));
        // compression de l'image
        image = compression(image);
        // conversion en byte
        avatar.setImage(convertToByte(image));
        avatar.save();
        buildAvatarPath(avatar);
        avatar.update("path");
        return avatar;
    }

    protected BufferedImage scale(BufferedImage bi) {
        // calcul le rapport
        double scaleValue = MAX_WIDTH / bi.getWidth();
        BufferedImage biNew = bi;
        // si image trop grande, réduction
        if (scaleValue < 1.0) {
            AffineTransform tx = new AffineTransform();
            tx.scale(scaleValue, scaleValue);
            AffineTransformOp op = new AffineTransformOp(tx, AffineTransformOp.TYPE_BILINEAR);
            biNew = new BufferedImage((int) (bi.getWidth() * scaleValue), (int) (bi.getHeight() * scaleValue),
                    bi.getType());
            return op.filter(bi, biNew);
        }
        return biNew;
    }

    protected BufferedImage compression(BufferedImage image) throws IOException {
        String tempDir = System.getProperty("java.io.tmpdir");

        File compressedImageFile = new File(tempDir + "/new" + new Date().getTime());

        OutputStream os = new FileOutputStream(compressedImageFile);

        float quality = 0.5f;

        // get all image writers for JPG format
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");

        ImageWriter writer = writers.next();
        ImageOutputStream ios = ImageIO.createImageOutputStream(os);
        writer.setOutput(ios);

        ImageWriteParam param = writer.getDefaultWriteParam();

        // compress to a given quality
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        // appends a complete image stream containing a single image and
        // associated stream and image metadata and thumbnails to the output
        writer.write(null, new IIOImage(image, null, null), param);

        // close all streams
        os.close();
        ios.close();
        writer.dispose();
        BufferedImage cimg = ImageIO.read(compressedImageFile);
        // suppression du fichier temp
        compressedImageFile.delete();
        return cimg;
    }

    protected byte[] convertToByte(BufferedImage bimg) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bimg, "jpg", baos);
        baos.flush();
        byte[] imageInByte = baos.toByteArray();
        baos.close();
        return imageInByte;
    }

    protected void buildAvatarPath(Avatar avatar) {
        avatar.setPath("/rest/avatars/" + avatar.getId());
    }
}
