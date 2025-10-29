// Calculation logic for the expense splitting
import { Item, Participant, CalculationResult } from '@/types';

export interface Settlement {
    from: string;
    to: string;
    amount: number;
}

export const calculateBalances = (
    items: Item[],
    participants: Participant[]
): CalculationResult[] => {
    const results: CalculationResult[] = [];

    // Calculate total owed for each participant
    participants.forEach((participant) => {
        let totalOwed = 0;

        participant.usage.forEach((usage) => {
            const item = items.find((i) => i.id === usage.itemId);
            if (item) {
                totalOwed += item.unitPrice * usage.unitsUsed;
            }
        });

        const balance = participant.amountPaid - totalOwed;

        results.push({
            participantId: participant.id,
            participantName: participant.name,
            totalOwed,
            amountPaid: participant.amountPaid,
            balance,
        });
    });

    return results;
};

export const calculateSettlements = (results: CalculationResult[]): Settlement[] => {
    // Create mutable copies of creditors and debtors with remaining amounts
    const creditors = results
        .filter(r => r.balance > 0.01)
        .map(r => ({ name: r.participantName, remaining: r.balance }))
        .sort((a, b) => b.remaining - a.remaining);

    const debtors = results
        .filter(r => r.balance < -0.01)
        .map(r => ({ name: r.participantName, remaining: Math.abs(r.balance) }))
        .sort((a, b) => b.remaining - a.remaining);

    const settlements: Settlement[] = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    // Continue until all debts are settled
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
        const creditor = creditors[creditorIndex];
        const debtor = debtors[debtorIndex];

        // Skip if either has no remaining balance
        if (creditor.remaining < 0.01) {
            creditorIndex++;
            continue;
        }
        if (debtor.remaining < 0.01) {
            debtorIndex++;
            continue;
        }

        // Calculate the settlement amount (minimum of what debtor owes and creditor is owed)
        const settlementAmount = Math.min(debtor.remaining, creditor.remaining);

        if (settlementAmount > 0.01) {
            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: parseFloat(settlementAmount.toFixed(2))
            });

            // Update remaining amounts
            debtor.remaining -= settlementAmount;
            creditor.remaining -= settlementAmount;
        }

        // Move to next debtor if fully settled
        if (debtor.remaining < 0.01) {
            debtorIndex++;
        }

        // Move to next creditor if fully settled
        if (creditor.remaining < 0.01) {
            creditorIndex++;
        }
    }

    return settlements;
};

export const getTotalExpense = (items: Item[]): number => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const getTotalPaid = (participants: Participant[]): number => {
    return participants.reduce((sum, p) => sum + p.amountPaid, 0);
};
