import axiosInstance from "@/utils/axiosInstance";

export async function subscribeUser(userId: number) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    let subscription = await registration.pushManager.getSubscription();
    console.log(subscription)

    // Get VAPID public key (from backend)
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    // Subscribe to push
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });
    }
    // Send to backend
    await axiosInstance.post("/notifications/subscribe", {
      user_id: userId,
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    });


  } catch (err) {
    console.log("Push subscription failed:", err);
  }
}

// Helper to convert base64 key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
