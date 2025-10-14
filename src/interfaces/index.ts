export interface INotificationAdapter {
    success(message: string, options?: any): void;
    error(message: string, options?: any): void;
}