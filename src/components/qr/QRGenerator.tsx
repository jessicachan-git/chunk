import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../ui/Card';

interface QRGeneratorProps {
  url: string;
  stationName: string;
  color?: string;
  size?: number;
}

export function QRGenerator({ url, stationName, color = '#6366f1', size = 200 }: QRGeneratorProps) {
  return (
    <Card className="flex flex-col items-center gap-4">
      <div className="bg-white rounded-2xl p-4">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          fgColor="#0f0f14"
          bgColor="#ffffff"
        />
      </div>
      <div className="text-center">
        <p className="font-medium" style={{ color }}>{stationName}</p>
        <p className="text-xs text-muted mt-1 break-all max-w-[250px]">{url}</p>
      </div>
    </Card>
  );
}
