document.addEventListener("DOMContentLoaded", function () {
    const notificationList = document.getElementById("notificationList");
    if (!notificationList) return;

    let notifications = [];
    try {
        const saved = JSON.parse(localStorage.getItem("forumNotifications") || "[]");
        notifications = Array.isArray(saved) ? saved : [];
    } catch (error) {
        notifications = [];
    }

    if (notifications.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-notifications";
        empty.innerHTML = "<div class=\"empty-icon\" aria-hidden=\"true\">🔔</div><h3>No notifications yet</h3><p>You're all caught up! New activity will appear here.</p>";
        notificationList.replaceChildren(empty);
        return;
    }

    notificationList.replaceChildren();
    notifications.forEach(function (notification) {
        const item = document.createElement("article");
        item.className = "notification-item";

        const icon = document.createElement("div");
        icon.className = "notification-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "🔔";

        const content = document.createElement("div");
        content.className = "notification-content";
        const title = document.createElement("h3");
        title.textContent = notification.title || "New Activity";
        const message = document.createElement("p");
        message.textContent = notification.message || "";
        content.append(title, message);

        const time = document.createElement("div");
        time.className = "notification-time";
        time.textContent = notification.time || "Recently";

        item.append(icon, content, time);
        notificationList.appendChild(item);
    });
});
