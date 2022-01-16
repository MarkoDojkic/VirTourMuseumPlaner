export interface Message {
    text: string;
    date: Date;
    reply: boolean;
    type: string;
    user: {
        name: string,
        avatar: string
    };
}
