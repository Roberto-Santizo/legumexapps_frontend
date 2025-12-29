import { INotificationAdapter } from "@/interfaces";
import { toast } from "react-hot-toast";

export class ReactHotToastAdapter implements INotificationAdapter {
    success(message: string, options: any): void {
        toast.success(message, options);
    }
    error(message: string, options: any): void {
        toast.error(message, options);
    }

}