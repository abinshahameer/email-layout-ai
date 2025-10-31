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

  const getCroppedImg = () => {
    const image = imageRef.current;
    if (!image || !crop || !crop.width || !crop.height) {
      return;
    }

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleCrop = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      onCrop(croppedImage);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
          >
            <img ref={imageRef} src={image} alt="Crop preview" />
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
