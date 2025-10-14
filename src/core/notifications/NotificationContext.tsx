import { INotificationAdapter } from "@/interfaces";
import React, { createContext, useContext } from "react";

interface NotificationContextType {
    notify: INotificationAdapter;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = (): INotificationAdapter => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification debe usarse dentro de un NotificationProvider");
    }

    return context.notify;
}

interface Props {
    adapter: INotificationAdapter;
    children: React.ReactNode;
    container: React.JSX.Element;
}


export const NotificationProvider: React.FC<Props> = ({ adapter, children, container }) => {
    return (
        <NotificationContext.Provider value={{ notify: adapter }}>
            {children}
            {container}
        </NotificationContext.Provider>
    );
}