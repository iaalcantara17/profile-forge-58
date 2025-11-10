import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Notification {
  id: string;
  type: 'deadline' | 'interview' | 'status' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  jobId?: string;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('jobhuntr_notifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotifications(parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      })));
    }

    // Check for deadline notifications
    checkDeadlines();
    
    // Set up interval to check deadlines every hour
    const interval = setInterval(checkDeadlines, 3600000);
    return () => clearInterval(interval);
  }, []);

  const checkDeadlines = () => {
    const jobs = localStorage.getItem('jobs');
    if (!jobs) return;

    const jobList = JSON.parse(jobs);
    const now = new Date();
    const newNotifications: Notification[] = [];

    jobList.forEach((job: any) => {
      if (!job.applicationDeadline) return;
      
      const deadline = new Date(job.applicationDeadline);
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil === 3 || daysUntil === 1) {
        const existing = notifications.find(
          n => n.jobId === job.id && n.type === 'deadline'
        );
        
        if (!existing) {
          newNotifications.push({
            id: `deadline-${job.id}-${Date.now()}`,
            type: 'deadline',
            title: 'Application Deadline Approaching',
            message: `${job.jobTitle} at ${job.company.name} is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
            timestamp: new Date(),
            read: false,
            jobId: job.id,
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      const updated = [...notifications, ...newNotifications];
      setNotifications(updated);
      localStorage.setItem('jobhuntr_notifications', JSON.stringify(updated));
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('jobhuntr_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('jobhuntr_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('jobhuntr_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return '⏰';
      case 'interview':
        return '📅';
      case 'status':
        return '📊';
      default:
        return '🔔';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 rounded-none border-0 cursor-pointer hover:bg-accent ${
                    !notification.read ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleDateString()} at{' '}
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};