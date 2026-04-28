"use client";

import { useState, useEffect } from "react";
import { QrCode, Download } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface QRModalProps {
  url: string;
  name: string;
}

export function QRModal({ url, name }: QRModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setDataUrl);
  }, [url]);

  function handleDownload() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${name}.png`;
    a.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" title="QR Code">
          <QrCode className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code — {name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 mt-4">
          {dataUrl && (
            <img src={dataUrl} alt="QR Code" className="w-64 h-64 rounded-xl border border-gray-100 dark:border-gray-800" />
          )}
          <p className="text-xs text-gray-400 text-center font-mono break-all">{url}</p>
          <Button onClick={handleDownload} variant="outline" className="gap-2 w-full">
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
