"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export default function PushSubscriptionManager() {
    const [status, setStatus] = useState("");
    const [accessToken, setAccessToken] = useState("");

    const subscribeUser = async () => {
        if (!accessToken) {
            setStatus("Please enter your access token first.");
            return;
        }

        setStatus("Requesting notification permission...");

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            setStatus("Notification permission denied");
            return;
        }

        try {
            setStatus("Subscribing...");

            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            if (!subscription) {
                setStatus("Subscription undefined. Failed.");
                return;
            }

            console.log("Push subscription:", subscription);

            // Send to FastAPI with access token
            const response = await fetch("http://127.0.0.1:8000/api/v1/users/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "ngrok-skip-browser-warning": "1",
                },
                body: JSON.stringify(subscription),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("Subscription saved successfully.");
            } else {
                setStatus("Server error: " + JSON.stringify(data));
            }
        } catch (err) {
            console.error(err);
            setStatus("Subscription failed.");
        }
    };

    return (
        <div className="p-4 space-y-3">
            <input
                type="text"
                placeholder="Enter access token"
                className="w-full px-2 py-1 border rounded"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
            />

            <button
                onClick={subscribeUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Enable Notifications
            </button>

            <p className="text-gray-700">{status}</p>
        </div>
    );
}
