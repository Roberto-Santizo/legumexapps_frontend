import { toast } from "react-toastify";
import { INotificationAdapter } from "@/interfaces";

export class ReactTostifyAdapter implements INotificationAdapter {
    success(message: string, options: any): void {
        toast.success(message, options);
    }
    error(message: string, options: any): void {
        toast.error(message, options);
    }

}