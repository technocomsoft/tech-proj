self.addEventListener('push', function (evt) {
    evt.waitUntil(self.registration.pushManager.getSubscription().then(function (subscription) {
        if ('subscriptionId' in subscription) {
            sub = subscription.subscriptionId;
        } else {
            sub = subscription.endpoint;
        }
        return fetch("./json.aspx").then(function (response) {
            return response.json().then(function (json) {
                console.log(json.notifications.length)

                var promises = [];
                for (var i = 0; i < json.notifications.length; i++) {

                    var msg = json.notifications[i];
                    console.log(msg.title);
                    var title = msg.title;
                    var message = msg.message;
                    var notificationTag = msg.id;
                    icon = 'logo.png';

                    promises.push(showNotification(title, message, icon, notificationTag));

                }
                return Promise.all(promises);

            });
        });
    }));
});

function showNotification(title, message, icon, tag) {
    setTimeout(function () {
        return self.registration.showNotification(title, {
            body: message,
            icon: icon,
            tag: tag
        });
    }, 5000);
}

function parseString(param) {
    var arr = [];
    param.split("&").forEach(function (item) {
        var parts = item.split("=");
        var key = parts[0];
        var value = decodeURIComponent(parts[1]);
        arr[key] = value;
    });
    return arr;
}

self.addEventListener('notificationclick', function (evt) {
    evt.notification.close();

    var arr = parseString(evt.notification.icon);

    return clients.openWindow("http://www.technocomsoft.com/");
});
