export interface Request {
    status: "ACCEPTED" | "PENDING";
    senderId: number;
    receiverId: number;
}

export interface RequestResponse {
    id: number;
    status: "ACCEPTED" | "PENDING";
    senderId: number;
    receiverId: number;
}