import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private channelId = 'mining-complete';
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: this.channelId,
          name: 'Mining Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });
      }

      // Request permissions for iOS
      if (Platform.OS === 'ios') {
        await notifee.requestPermission();
      }

      this.initialized = true;
    } catch (err) {
      // If native module isn't available, warn and continue without failing
      console.warn('Notifee not available during initialize():', err);
      this.initialized = false;
    }
  }

  async scheduleMiningCompleteNotification(durationSeconds: number) {
    try {
      await this.initialize();

      const trigger: any = {
        type: 1, // TimeTrigger
        timestamp: Date.now() + durationSeconds * 1000,
      };

      const notificationId = await notifee.createTriggerNotification(
        {
          id: 'mining-complete',
          title: '⛏️ Mining Complete!',
          body: 'Your mining session has finished. Tap to claim your rewards!',
          android: {
            channelId: this.channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            sound: 'default',
          },
          ios: {
            sound: 'default',
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: true,
            },
          },
          data: {
            screen: 'Home',
          },
        },
        trigger,
      );

      console.log('📅 Scheduled mining complete notification:', notificationId);
      return notificationId;
    } catch (err) {
      console.warn('Notifee not available during scheduleMiningCompleteNotification():', err);
      return null;
    }
  }

  async cancelMiningNotification() {
    try {
      await notifee.cancelNotification('mining-complete');
      console.log('🚫 Cancelled mining notification');
    } catch (err) {
      console.warn('Notifee not available during cancelMiningNotification():', err);
    }
  }

  async displayImmediateNotification(title: string, body: string) {
    try {
      await this.initialize();
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
        data: {
          screen: 'Home',
        },
      });
    } catch (err) {
      console.warn('Notifee not available during displayImmediateNotification():', err);
    }
  }

  setupNotificationHandler(navigationRef: any) {
    try {
      // Handle notification press when app is in background or foreground
      return notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log('📱 Notification pressed:', detail.notification);
          const screen = detail.notification?.data?.screen;
          if (screen && navigationRef?.current) {
            navigationRef.current.navigate(screen);
          }
        }
      });
    } catch (err) {
      console.warn('Notifee not available during setupNotificationHandler():', err);
      // Return a no-op unsubscribe function so caller can always call it
      return () => {};
    }
  }

  async handleBackgroundNotification() {
    try {
      // Handle notification press when app is killed/closed
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log('📱 Background notification pressed:', detail.notification);
          // Navigation will be handled when app starts
        }
      });
    } catch (err) {
      console.warn('Notifee not available during handleBackgroundNotification():', err);
    }
  }
}

export const notificationService = new NotificationService();
