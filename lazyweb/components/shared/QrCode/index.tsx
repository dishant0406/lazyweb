import QRCodeStyling, { Options } from "qr-code-styling";
import React, { useEffect, useRef } from "react";

interface QRCodeProps {
  url: string;
  className?: string;
  height?: number;
  width?: number;
  margin?: number;
  imageMargin?: number;
}

const QRCode: React.FC<QRCodeProps> = ({
  url,
  className,
  height,
  width,
  imageMargin,
  margin,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrOptions: Options = {
      width: width || 300,
      data: url,
      margin: margin || 0.2,
      height: height || 300,
      type: "svg",
      image:
        "https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/LazywebLogo.png",
      dotsOptions: {
        color: "#202124",
        type: "rounded",
      },
      backgroundOptions: {
        round: 0.2,
      },
      cornersDotOptions: {
        type: "dot",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: imageMargin || 10,
      },
    };

    const qrCode = new QRCodeStyling(qrOptions);

    if (ref.current) {
      qrCode.append(ref.current);
    }

    qrCode.update({
      data: url,
    });

    return () => {
      // Clean up the QR code when the component unmounts
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [url]);

  return <div ref={ref} className={className} />;
};

export default QRCode;
