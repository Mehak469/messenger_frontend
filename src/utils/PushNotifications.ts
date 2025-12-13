// pushNotification.ts
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

export async function subscribePush(accessToken: string): Promise<string> {
    if (!accessToken) return "Access token missing";

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "Notification permission denied";

    try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        if (!subscription) return "Subscription failed";

        const res = await fetch("http://127.0.0.1:8000/api/v1/users/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "ngrok-skip-browser-warning": "1",
            },
            body: JSON.stringify(subscription),
        });

        const data = await res.json();

        if (res.ok) return "Subscription saved successfully";
        else return "Server error: " + JSON.stringify(data);
    } catch (err: unknown) {
        console.error(err);
        return "Subscription failed";
    }
}

export async function unsubscribePush(accessToken: string): Promise<string> {
    if (!accessToken) return "Access token missing";

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
        }

        const res = await fetch("http://127.0.0.1:8000/api/v1/users/unsubscribe", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "1",
            },
        });

        const data = await res.json();

        if (res.ok) return "Unsubscribed successfully";
        else return "Server error: " + JSON.stringify(data);
    } catch (err: unknown) {
        console.error(err);
        return "Unsubscribe failed";
    }
}
