import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const PinModal = ({ open, onOpenChange, onVerify, error }) => {
  const [pin, setPin] = useState('');

  const handleVerify = () => {
    onVerify(pin);
    setPin('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter PIN to Unlock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label htmlFor="pin">PIN Code</Label>
          <Input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            placeholder="****"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleVerify}>Unlock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PinModal;
