// Service Worker for notifications
const CACHE_NAME = 'moon-bloom-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.', event);
  event.notification.close();

  // Handle notification click - could navigate to specific page
  event.waitUntil(
    clients.openWindow('/home')
  );
});

self.addEventListener('push', (event) => {
  console.log('Push received.', event);

  const options = {
    body: 'Time to log your cycle data!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'cycle-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'log',
        title: 'Log Now'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Moon Bloom Tracker', options)
  );
});