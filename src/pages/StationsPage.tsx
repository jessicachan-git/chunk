import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../db/database';
import { generateToken, generateId } from '../crypto/random';
import { STATION_COLORS, STATION_ICONS } from '../utils/constants';
import { QRGenerator } from '../components/qr/QRGenerator';
import { QRPrintSheet } from '../components/qr/QRPrintSheet';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { UnlockStation } from '../types';

export function StationsPage() {
  const [stations, setStations] = useState<UnlockStation[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedStation, setSelectedStation] = useState<UnlockStation | null>(null);

  const loadStations = useCallback(async () => {
    const all = await db.unlockStations.toArray();
    setStations(all);
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleCreate = async (name: string, color: string, icon: string) => {
    const station: UnlockStation = {
      id: generateId(),
      name,
      token: generateToken(),
      createdAt: Date.now(),
      color,
      icon,
    };
    await db.unlockStations.put(station);
    setShowCreate(false);
    loadStations();
  };

  const handleDelete = async (id: string) => {
    await db.unlockStations.delete(id);
    setSelectedStation(null);
    loadStations();
  };

  const baseUrl = window.location.origin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Unlock Stations</h1>
          <p className="text-muted text-sm mt-1">QR codes & NFC tags</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Add
        </Button>
      </div>

      {stations.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-muted">No stations yet.</p>
          <p className="text-muted text-sm mt-1">
            Create your first unlock station and place it somewhere in your home.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {stations.map((station) => (
            <Card
              key={station.id}
              className="flex items-center gap-4 cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => setSelectedStation(station)}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: station.color + '20' }}
              >
                {station.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{station.name}</p>
                <p className="text-xs text-muted">Tap to view QR code</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {stations.length > 0 && (
        <Button
          variant="secondary"
          onClick={() => window.print()}
          className="w-full"
        >
          Print All QR Codes
        </Button>
      )}

      <QRPrintSheet stations={stations} baseUrl={baseUrl} />

      <CreateStationModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <Modal open={!!selectedStation} onClose={() => setSelectedStation(null)}>
        {selectedStation && (
          <div className="flex flex-col gap-4">
            <QRGenerator
              url={`${baseUrl}/unlock?token=${selectedStation.token}&station=${selectedStation.id}`}
              stationName={`${selectedStation.icon} ${selectedStation.name}`}
              color={selectedStation.color}
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const url = `${baseUrl}/unlock?token=${selectedStation.token}&station=${selectedStation.id}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                Copy URL
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(selectedStation.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

function CreateStationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string, icon: string) => void;
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(STATION_COLORS[0]);
  const [icon, setIcon] = useState(STATION_ICONS[0]);

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim(), color, icon);
      setName('');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">New Station</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Kitchen, Garage, Office"
          className="w-full bg-surface border border-surface-border rounded-xl p-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
          autoFocus
        />
        <div>
          <p className="text-sm text-muted mb-2">Icon</p>
          <div className="flex gap-2 flex-wrap">
            {STATION_ICONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                  icon === i ? 'bg-accent/20 border border-accent' : 'bg-surface border border-surface-border'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted mb-2">Color</p>
          <div className="flex gap-2">
            {STATION_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c ? 'ring-2 ring-offset-2 ring-offset-surface-elevated ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!name.trim()} className="w-full mt-2">
          Create Station
        </Button>
      </div>
    </Modal>
  );
}
