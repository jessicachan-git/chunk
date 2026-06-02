import { QRCodeSVG } from 'qrcode.react';
import type { UnlockStation } from '../../types';

interface QRPrintSheetProps {
  stations: UnlockStation[];
  baseUrl: string;
}

export function QRPrintSheet({ stations, baseUrl }: QRPrintSheetProps) {
  return (
    <div className="print:block hidden">
      <style>{`
        @media print {
          body { background: white !important; }
          .print-sheet { display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 2rem; padding: 2rem; }
          .print-card { border: 1px solid #ddd; border-radius: 12px; padding: 1.5rem; text-align: center; break-inside: avoid; }
        }
      `}</style>
      <div className="print-sheet">
        {stations.map((station) => (
          <div key={station.id} className="print-card">
            <QRCodeSVG
              value={`${baseUrl}/unlock?token=${station.token}&station=${station.id}`}
              size={160}
              level="M"
            />
            <p style={{ marginTop: '0.75rem', fontWeight: 600, fontSize: '1.1rem' }}>
              {station.icon} {station.name}
            </p>
            <p style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: '#666' }}>
              Scan to unlock Chunk
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
