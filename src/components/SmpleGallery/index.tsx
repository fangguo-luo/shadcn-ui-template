import React, { useEffect, useCallback, memo } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface Image {
    file_path: string;
    width: number;
    height: number;
}

interface SimpleGalleryProps {
    galleryID: string;
    images: Image[];
}

const SimpleGallery: React.FC<SimpleGalleryProps> = memo(({ galleryID, images }) => {
    const initLightbox = useCallback(() => {
        let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
            gallery: `#${galleryID}`,
            children: 'a',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox?.destroy();
            lightbox = null;
        };
    }, [galleryID]);

    useEffect(initLightbox, [initLightbox]);

    return (
        <div className="grid grid-cols-3 gap-2" id={galleryID}>
            {images.map((image, index) => (
                <GalleryItem
                    key={`${galleryID}-${index}`}
                    image={image}
                    index={index}
                />
            ))}
        </div>
    );
});

interface GalleryItemProps {
    image: Image;
    index: number;
}

const GalleryItem: React.FC<GalleryItemProps> = memo(({image, index}) => (<a href={image.file_path}
                                                                             data-pswp-width={image.width}
                                                                             data-pswp-height={image.height}
                                                                             target="_blank"
                                                                             rel="noreferrer"
    >
        <img src={image.file_path} alt={`Image ${index + 1}`} className="aspect-square object-cover" loading="lazy"/>
    </a>
));

export default SimpleGallery;