'use client';

import { useState } from 'react';
import { Item } from '@/types';
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

interface ItemEntryProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
}

export default function ItemEntry({ items, onItemsChange }: ItemEntryProps) {
  const [itemName, setItemName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleAddOrUpdateItem = () => {
    setError('');

    // Validation
    if (!itemName.trim()) {
      setError('আইটেমের নাম খালি রাখা যাবে না');
      return;
    }

    const priceNum = parseFloat(unitPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('একক দাম ০ বা তার বেশি হতে হবে');
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('পরিমাণ ০ এর বেশি হতে হবে');
      return;
    }

    if (editingId) {
      // Update existing item
      const updatedItems = items.map((item) =>
        item.id === editingId
          ? { ...item, name: itemName.trim(), unitPrice: priceNum, quantity: qtyNum }
          : item
      );
      onItemsChange(updatedItems);
      setEditingId(null);
    } else {
      // Add new item
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName.trim(),
        unitPrice: priceNum,
        quantity: qtyNum,
      };
      onItemsChange([...items, newItem]);
    }

    // Reset form
    setItemName('');
    setUnitPrice('');
    setQuantity('');
  };

  const handleEdit = (item: Item) => {
    setItemName(item.name);
    setUnitPrice(item.unitPrice.toString());
    setQuantity(item.quantity.toString());
    setEditingId(item.id);
    setError('');
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleCancelEdit = () => {
    setItemName('');
    setUnitPrice('');
    setQuantity('');
    setEditingId(null);
    setError('');
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-2 border-purple-100 dark:border-purple-700/50 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-3xl">�️</span>
          আইটেম এন্ট্রি
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">আইটেমের নাম</label>
            <Input
              placeholder="যেমন: চা, বিস্কুট, পেট্রোল"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">একক দাম (৳)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              min="0"
              step="0.01"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">পরিমাণ</label>
            <Input
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              step="0.01"
              className="h-9"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleAddOrUpdateItem}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-9"
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

        {items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">আইটেম তালিকা</h3>
            <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="dark:bg-slate-800/50">
                    <TableHead className="dark:text-gray-200">নাম</TableHead>
                    <TableHead className="dark:text-gray-200">একক দাম</TableHead>
                    <TableHead className="dark:text-gray-200">পরিমাণ</TableHead>
                    <TableHead className="dark:text-gray-200">মোট</TableHead>
                    <TableHead className="text-right dark:text-gray-200">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="dark:border-slate-700">
                      <TableCell className="font-medium dark:text-gray-200">{item.name}</TableCell>
                      <TableCell className="dark:text-gray-300">৳{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.quantity}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        ৳{(item.unitPrice * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="cursor-pointer h-8 dark:hover:bg-slate-700"
                        >
                          আপডেট করুন
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer h-8 dark:bg-red-700 dark:hover:bg-red-800"
                        >
                          মুছুন
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
