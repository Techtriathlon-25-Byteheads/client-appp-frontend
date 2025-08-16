export interface TimeSlot {
    id: string;
    time: string;
}

export const MORNING_SLOTS: TimeSlot[] = [
    { id: '1', time: '8:00 AM' },
    { id: '2', time: '8:30 AM' },
    { id: '3', time: '9:00 AM' },
    { id: '4', time: '9:30 AM' },
    { id: '5', time: '10:00 AM' },
    { id: '6', time: '10:30 AM' },
    { id: '7', time: '11:00 AM' },
    { id: '8', time: '11:30 AM' },
];

export const EVENING_SLOTS: TimeSlot[] = [
    { id: '9', time: '1:00 PM' },
    { id: '10', time: '1:30 PM' },
    { id: '11', time: '2:00 PM' },
    { id: '12', time: '2:30 PM' },
    { id: '13', time: '3:00 PM' },
    { id: '14', time: '3:30 PM' },
    { id: '15', time: '4:00 PM' },
    { id: '16', time: '4:30 PM' },
];
