
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScanLine } from 'lucide-react';

const QRScanner = ({ onScan }) => {
  const [open, setOpen] = useState(false);

  const handleScan = (result, error) => {
    if (result) {
      onScan(result?.text);
      setOpen(false);
    }

    if (error) {
      console.info(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ScanLine className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        {open && (
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
