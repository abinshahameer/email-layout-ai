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
  if (!image || !crop || !crop.width || !crop.height) return;

  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const maxWidth = 600; // 🔥 important for email
  const scale = Math.min(1, maxWidth / crop.width);

  canvas.width = crop.width * scale;
  canvas.height = crop.height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

    // Better image quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // 🔥 quality compression
  return canvas.toDataURL("image/jpeg", 0.7);
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
