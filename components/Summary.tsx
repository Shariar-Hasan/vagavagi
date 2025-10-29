'use client';

import { Item, Participant, CalculationResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calculateBalances, calculateSettlements, getTotalExpense, getTotalPaid } from '@/lib/calculations';
import { exportToPDF } from '@/lib/pdf-export';
import { useState } from 'react';

interface SummaryProps {
  items: Item[];
  participants: Participant[];
}

export default function Summary({ items, participants }: SummaryProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const calculatedResults = calculateBalances(items, participants);
    setResults(calculatedResults);
    setCalculated(true);
  };

  const handleExportPDF = () => {
    if (results.length > 0) {
      exportToPDF(items, participants, results);
    }
  };

  const totalExpense = getTotalExpense(items);
  const totalPaid = getTotalPaid(participants);
  const difference = totalPaid - totalExpense;

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-2 border-green-100 dark:border-green-700/50 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-3xl">🧮</span>
          হিসাব সারসংক্ষেপ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 || participants.length === 0 ? (
          <Alert>
            <AlertDescription>
              হিসাব করার জন্য অনুগ্রহ করে আইটেম এবং অংশগ্রহণকারী যোগ করুন
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground dark:text-gray-400">মোট খরচ</div>
                  <div className="text-2xl font-bold dark:text-gray-100">৳{totalExpense.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground dark:text-gray-400">মোট পরিশোধ</div>
                  <div className="text-2xl font-bold dark:text-gray-100">৳{totalPaid.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground dark:text-gray-400">পার্থক্য</div>
                  <div
                    className={`text-2xl font-bold ${
                      difference === 0
                        ? 'text-green-600'
                        : difference > 0
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`}
                  >
                    ৳{difference.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={handleCalculate} 
                size="lg"
                className="w-full sm:w-auto bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                🧮 ক্যালকুলেট করুন
              </Button>

              {calculated && results.length > 0 && (
                <Button 
                  onClick={handleExportPDF} 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  📄 PDF ডাউনলোড করুন
                </Button>
              )}
            </div>

            {calculated && results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">সেটেলমেন্ট বিবরণ</h3>

                <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:bg-slate-800/50">
                        <TableHead className="dark:text-gray-200">নাম</TableHead>
                        <TableHead className="dark:text-gray-200">মোট দায়</TableHead>
                        <TableHead className="dark:text-gray-200">পরিশোধিত</TableHead>
                        <TableHead className="dark:text-gray-200">ব্যালেন্স</TableHead>
                        <TableHead className="dark:text-gray-200">স্ট্যাটাস</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.participantId} className="dark:border-slate-700">
                          <TableCell className="font-medium dark:text-gray-200">
                            {result.participantName}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">৳{result.totalOwed.toFixed(2)}</TableCell>
                          <TableCell className="dark:text-gray-300">৳{result.amountPaid.toFixed(2)}</TableCell>
                          <TableCell
                            className={
                              result.balance >= 0
                                ? 'text-green-600 dark:text-green-400 font-semibold'
                                : 'text-red-600 dark:text-red-400 font-semibold'
                            }
                          >
                            ৳{Math.abs(result.balance).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {result.balance > 0 ? (
                              <Badge className="bg-green-600 dark:bg-green-700">ফেরত পাবেন</Badge>
                            ) : result.balance < 0 ? (
                              <Badge variant="destructive" className="dark:bg-red-700">দিতে হবে</Badge>
                            ) : (
                              <Badge variant="secondary" className="dark:bg-slate-700">সমান</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3 dark:text-gray-100">সেটেলমেন্ট নির্দেশনা</h4>
                  <div className="space-y-2">
                    {calculateSettlements(results).map((settlement, index) => (
                      <Alert key={index} className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-900/40 border-blue-200 dark:border-blue-700/50 backdrop-blur-sm">
                        <AlertDescription className="flex items-center gap-2">
                          <span className="text-2xl">💸</span>
                          <div className="dark:text-gray-100">
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              {settlement.from}
                            </span>{' '}
                            কে{' '}
                            <span className="font-semibold text-green-700 dark:text-green-300">
                              {settlement.to}
                            </span>{' '}
                            কে <span className="font-bold text-lg text-purple-600 dark:text-purple-300">৳{settlement.amount.toFixed(2)}</span>{' '}
                            দিতে হবে
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                    {calculateSettlements(results).length === 0 && (
                      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 backdrop-blur-sm">
                        <AlertDescription className="flex items-center gap-2">
                          <span className="text-2xl">✅</span>
                          <span className="text-green-700 dark:text-green-300 font-medium">সব হিসাব সমান! কোন লেনদেন প্রয়োজন নেই।</span>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
