// Type definitions for the Vagavagi app

export interface Item {
    id: string;
    name: string;
    unitPrice: number;
    quantity: number;
}

export interface ParticipantUsage {
    itemId: string;
    unitsUsed: number;
}

export interface Participant {
    id: string;
    name: string;
    amountPaid: number;
    usage: ParticipantUsage[];
}

export interface CalculationResult {
    participantId: string;
    participantName: string;
    totalOwed: number;
    amountPaid: number;
    balance: number; // positive means they should receive, negative means they should pay
}
