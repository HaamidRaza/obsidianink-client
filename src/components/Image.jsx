import { Image, ImageKitProvider, buildSrc } from "@imagekit/react";
import { useState, useCallback } from "react";

const CustomImage = ({
  src,
  className,
  load,
  width,
  height,
  alt = "image",
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const hidePlaceholder = () => setShowPlaceholder(false);

  const imgRef = useCallback((img) => {
    if (!img) return; // unmount

    if (img.complete) {
      hidePlaceholder();
      return;
    }
  }, []);

  return (
    <ImageKitProvider urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={load || "lazy"}
        ref={imgRef}
        onLoad={hidePlaceholder}
        transformation={[
          {
            width: width,
            height: height,
            quality: 90,
          },
        ]}
        style={
          showPlaceholder
            ? {
                backgroundImage: `url(${buildSrc({
                  urlEndpoint: import.meta.env.VITE_IK_URL_ENDPOINT,
                  src: src,
                  transformation: [
                    {
                      quality: 10,
                      blur: 90,
                    },
                  ],
                })})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      />
    </ImageKitProvider>
  );
};

export default CustomImage;
