import * as React from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { capCanvasToLimit } from "@/lib/image";

interface ImageCropperProps {
  image: string;
  onCrop: (croppedImage: string) => void;
  onClose: () => void;
}

export function ImageCropper({ image, onCrop, onClose }: ImageCropperProps) {
  const [crop, setCrop] = React.useState<Crop>();
  const imageRef = React.useRef<HTMLImageElement>(null);

  // 🧩 Automatically set crop to full image once the image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width,
      height,
    });
  };

const getCroppedImg = () => {
  const image = imageRef.current;

  if (!image || !crop?.width || !crop?.height) return null;

  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Actual crop size in original image resolution
  const naturalCropWidth = crop.width * scaleX;
  const naturalCropHeight = crop.height * scaleY;

  let targetWidth = naturalCropWidth;
  let targetHeight = naturalCropHeight;

  // Downscale only if image is too large
  const maxWidth = 1000;

  if (naturalCropWidth > maxWidth) {
    const resizeScale = maxWidth / naturalCropWidth;

    targetWidth = maxWidth;
    targetHeight = naturalCropHeight * resizeScale;
  }

  // Prevent blurry fractional canvas sizes
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Better rendering quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    naturalCropWidth,
    naturalCropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Adaptive compression, with a hard size cap for oversized images.
  const quality = targetWidth < 600 ? 0.9 : 0.82;

  return capCanvasToLimit(canvas, quality);
};

  const handleCrop = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      onCrop(croppedImage);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              onLoad={handleImageLoad} // ✅ Ensures full crop selection
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
