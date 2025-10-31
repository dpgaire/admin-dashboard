import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Maximize, Minimize } from "lucide-react";

const LibraryDetailModal = ({ libraryItem }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const iframe = document.getElementById(`pdf-iframe-${libraryItem.id}`);
    if (iframe) {
      if (!isFullScreen) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
          /* Firefox */
          iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          /* IE/Edge */
          iframe.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='cursor-pointer' variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-4xl ${isFullScreen ? "w-screen h-screen max-w-none" : ""}`}>
        <DialogHeader className="flex flex-row justify-between items-center">
          <div>
            <DialogTitle>{libraryItem.title}</DialogTitle>
            <DialogDescription>{libraryItem.author}</DialogDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </DialogHeader>
        <div className={`h-[80vh] ${isFullScreen ? "h-[calc(100vh-80px)]" : ""}`}>
          <iframe
            id={`pdf-iframe-${libraryItem.id}`}
            src={libraryItem.url}
            title={libraryItem.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LibraryDetailModal;