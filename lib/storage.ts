// LocalStorage utility functions
import { Item, Participant } from '@/types';

const ITEMS_KEY = 'vagavagi_items';
const PARTICIPANTS_KEY = 'vagavagi_participants';

export const saveItems = (items: Item[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    }
};

export const loadItems = (): Item[] => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(ITEMS_KEY);
        return data ? JSON.parse(data) : [];
    }
    return [];
};

export const saveParticipants = (participants: Participant[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
    }
};

export const loadParticipants = (): Participant[] => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(PARTICIPANTS_KEY);
        return data ? JSON.parse(data) : [];
    }
    return [];
};

export const clearAllData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ITEMS_KEY);
        localStorage.removeItem(PARTICIPANTS_KEY);
    }
};
