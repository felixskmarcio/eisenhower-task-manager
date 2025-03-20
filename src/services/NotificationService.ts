import { Subject } from 'rxjs';

interface Notification {
  type: string;
  message: string;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private subject = new Subject<Notification>();

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  sendNotification(notification: Notification) {
    this.subject.next(notification);
  }

  getNotifications() {
    return this.subject.asObservable();
  }
}

export default NotificationService.getInstance();