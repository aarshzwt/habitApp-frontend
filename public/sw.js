self.addEventListener("push", (event) => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/images/logo.png",
        data: {
            url: data.url
        }
    });
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((clientsList) => {
                for (const client of clientsList) {
                    if (client.url === targetUrl && "focus" in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(targetUrl);
            })
    );
});
