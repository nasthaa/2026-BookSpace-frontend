import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5105/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export type Room = {
    id: number;
    name: string;
    capacity: number;
    location: string;
};

export type Booking = {
    id: number;
    borrowerName: string;
    startTime: string;
    endTime: string;
    status: string;
    room: {
        id: number;
        name: string;
    };
};
