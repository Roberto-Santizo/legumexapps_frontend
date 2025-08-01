import { useQueryClient } from "@tanstack/react-query";
import { WeeklyProductionPlanDraft } from "types/draftWeeklyProductionPlanTypes";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: Echo<any>;
        Pusher: typeof Pusher;
    }
}

const token = localStorage.getItem('AUTH_TOKEN');

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: import.meta.env.VITE_PUSHER_APP_BROADCASTER,
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_BASE_URL}broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
});

export const usePlanificationWebSocket = (id: WeeklyProductionPlanDraft['id']) => {
    const queryClient = useQueryClient();

    var channel = window.Echo.private('planification.change');


    channel.subscribed(() => console.log('suscrito')).listen('.UpdateProductionPlanification', function () {
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftLines', id] });
        queryClient.invalidateQueries({ queryKey: ['getDraftWeeklyPlanById', id] });
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftItems', id] });
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftRawMaterial', id] });
    });
}