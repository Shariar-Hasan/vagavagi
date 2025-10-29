'use client';

import { useState, useRef } from 'react';
import { Item, Participant, ParticipantUsage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ParticipantEntryProps {
  items: Item[];
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
}

export default function ParticipantEntry({
  items,
  participants,
  onParticipantsChange,
}: ParticipantEntryProps) {
  const [participantName, setParticipantName] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [usage, setUsage] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const handleAddOrUpdateParticipant = () => {
    setError('');

    // Validation
    if (!participantName.trim()) {
      setError('নাম খালি রাখা যাবে না');
      return;
    }

    const paidNum = parseFloat(amountPaid);
    if (isNaN(paidNum) || paidNum < 0) {
      setError('পরিশোধ করা টাকা ০ বা তার বেশি হতে হবে');
      return;
    }

    // Validate usage against available quantities
    const usageArray: ParticipantUsage[] = [];
    for (const [itemId, unitsStr] of Object.entries(usage)) {
      const unitsUsed = parseFloat(unitsStr);
      if (!isNaN(unitsUsed) && unitsUsed > 0) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          // Calculate total already used by other participants
          const totalUsedByOthers = participants
            .filter((p) => p.id !== editingId)
            .reduce((sum, p) => {
              const pUsage = p.usage.find((u) => u.itemId === itemId);
              return sum + (pUsage?.unitsUsed || 0);
            }, 0);

          const availableUnits = item.quantity - totalUsedByOthers;

          if (unitsUsed > availableUnits) {
            setError(
              `"${item.name}" এর জন্য শুধুমাত্র ${availableUnits.toFixed(2)} ইউনিট পাওয়া যাচ্ছে`
            );
            return;
          }

          usageArray.push({ itemId, unitsUsed });
        }
      }
    }

    if (editingId) {
      // Update existing participant
      const updatedParticipants = participants.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: participantName.trim(),
              amountPaid: paidNum,
              usage: usageArray,
            }
          : p
      );
      onParticipantsChange(updatedParticipants);
      setEditingId(null);
    } else {
      // Add new participant
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: participantName.trim(),
        amountPaid: paidNum,
        usage: usageArray,
      };
      onParticipantsChange([...participants, newParticipant]);
    }

    // Reset form
    setParticipantName('');
    setAmountPaid('');
    setUsage({});
  };

  const handleEdit = (participant: Participant) => {
    setParticipantName(participant.name);
    setAmountPaid(participant.amountPaid.toString());

    const usageMap: Record<string, string> = {};
    participant.usage.forEach((u) => {
      usageMap[u.itemId] = u.unitsUsed.toString();
    });
    setUsage(usageMap);

    setEditingId(participant.id);
    setError('');
    
    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = (id: string) => {
    onParticipantsChange(participants.filter((p) => p.id !== id));
  };

  const handleCancelEdit = () => {
    setParticipantName('');
    setAmountPaid('');
    setUsage({});
    setEditingId(null);
    setError('');
  };

  const handleUsageChange = (itemId: string, value: string) => {
    setUsage({ ...usage, [itemId]: value });
  };

  const getItemUsageSummary = (item: Item): string => {
    const totalUsed = participants.reduce((sum, p) => {
      const pUsage = p.usage.find((u) => u.itemId === item.id);
      return sum + (pUsage?.unitsUsed || 0);
    }, 0);
    return `${totalUsed.toFixed(2)} / ${item.quantity}`;
  };

  return (
      <Card ref={formRef} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-2 border-indigo-100 dark:border-indigo-700/50 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-3xl">👥</span>
          অংশগ্রহণকারী এন্ট্রি
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {items.length === 0 && (
          <Alert>
            <AlertDescription>
              অংশগ্রহণকারী যোগ করার আগে অনুগ্রহ করে আইটেম যোগ করুন
            </AlertDescription>
          </Alert>
        )}

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">নাম</label>
                <Input
                  placeholder="অংশগ্রহণকারীর নাম"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">পরিশোধ করা টাকা (৳)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  min="0"
                  step="0.01"
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">প্রতিটি আইটেমের ব্যবহার</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <label className="text-xs font-medium">
                      {item.name}{' '}
                      <span className="text-xs text-muted-foreground">
                        ({getItemUsageSummary(item)})
                      </span>
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={usage[item.id] || ''}
                      onChange={(e) => handleUsageChange(item.id, e.target.value)}
                      min="0"
                      step="0.01"
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleAddOrUpdateParticipant}
                className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-9"
              >
                {editingId ? '✓ আপডেট করুন' : '+ যোগ করুন'}
              </Button>
              {editingId && (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer h-9"
                >
                  ✕ বাতিল
                </Button>
              )}
            </div>
          </>
        )}

        {participants.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2 dark:text-gray-100">অংশগ্রহণকারী তালিকা</h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <Card key={participant.id} className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-slate-800/80 dark:to-slate-700/80 border dark:border-slate-600/50">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-base dark:text-gray-100">
                          {participant.name}
                        </h4>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          পরিশোধ করেছেন: ৳{participant.amountPaid.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-x-1 flex">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(participant)}
                          className="cursor-pointer h-7 text-xs px-2"
                        >
                          আপডেট করুন
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(participant.id)}
                          className="cursor-pointer h-7 text-xs px-2"
                        >
                          মুছুন
                        </Button>
                      </div>
                    </div>

                    {participant.usage.length > 0 && (
                      <div className="overflow-x-auto">
                        <Table className="text-xs">
                          <TableHeader>
                            <TableRow className="h-8">
                              <TableHead className="py-1 text-xs">আইটেম</TableHead>
                              <TableHead className="py-1 text-xs">ব্যবহৃত</TableHead>
                              <TableHead className="py-1 text-xs">একক দাম</TableHead>
                              <TableHead className="py-1 text-xs">মোট</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {participant.usage.map((u) => {
                              const item = items.find((i) => i.id === u.itemId);
                              return item ? (
                                <TableRow key={u.itemId} className="h-8">
                                  <TableCell className="py-1">{item.name}</TableCell>
                                  <TableCell className="py-1">{u.unitsUsed}</TableCell>
                                  <TableCell className="py-1">৳{item.unitPrice.toFixed(2)}</TableCell>
                                  <TableCell className="py-1">
                                    ৳{(u.unitsUsed * item.unitPrice).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ) : null;
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
