import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import SyncIndicator from "@/components/SyncIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { setupAppLock } from "@/lib/biometricAuth";
import { useUserProfile, useUpdateUserSettings, useDeleteAccount } from "@/hooks/useApi";
import {
  User,
  Bell,
  Lock,
  HelpCircle,
  Trash2,
  LogOut,
  ChevronRight,
  Calendar,
  Mail,
  Heart,
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Notification helper functions
const scheduleCycleNotifications = () => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    // For demo purposes, schedule a notification in 10 seconds
    setTimeout(() => {
      new Notification('Moon Bloom Tracker', {
        body: 'Remember to log your cycle data today!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'cycle-reminder'
      });
    }, 10000); // 10 seconds for demo

    // Schedule another one in 1 minute for demo
    setTimeout(() => {
      new Notification('Moon Bloom Tracker', {
        body: 'How are you feeling today? Update your mood!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'mood-reminder'
      });
    }, 60000); // 1 minute for demo
  }
};

const checkBiometricSupport = async (): Promise<boolean> => {
  if ('credentials' in navigator && 'get' in navigator.credentials) {
    try {
      const available = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array([1, 2, 3, 4]),
          rp: { name: 'Moon Bloom Tracker' },
          user: { id: new Uint8Array([1]), name: 'user', displayName: 'User' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: { authenticatorAttachment: 'platform' }
        }
      } as CredentialRequestOptions);
      return available !== null;
    } catch {
      return false;
    }
  }
  return false;
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: userProfile } = useUserProfile();
  const updateSettingsMutation = useUpdateUserSettings();
  const deleteAccountMutation = useDeleteAccount();

  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);
  const [appLock, setAppLock] = useState(user?.appLockEnabled ?? false);
  const [cycleLength, setCycleLength] = useState(String(user?.cycleLength ?? 28));

  const [editingCycleLength, setEditingCycleLength] = useState(false);
  const [tempCycleLength, setTempCycleLength] = useState("");

  // Update state when userProfile loads
  React.useEffect(() => {
    if (userProfile) {
      setNotifications(userProfile.notificationsEnabled ?? true);
      setAppLock(userProfile.appLockEnabled ?? false);
      setCycleLength(String(userProfile.cycleLength ?? 28));
    }
  }, [userProfile]);

  // Update local state when user changes
  React.useEffect(() => {
    if (user) {
      setNotifications(user.notificationsEnabled ?? true);
      setAppLock(user.appLockEnabled ?? false);
      setCycleLength(String(user.cycleLength ?? 28));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettingsChange = async (settings: {
    notificationsEnabled?: boolean;
    appLockEnabled?: boolean;
    cycleLength?: number;
  }) => {
    try {
      await updateSettingsMutation.mutateAsync(settings);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationChange = async (enabled: boolean) => {
    setNotifications(enabled);

    if (enabled) {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Schedule some sample notifications for demo
          scheduleCycleNotifications();
          toast({
            title: "Notifications enabled",
            description: "You'll receive reminders about your cycle.",
          });
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          });
          setNotifications(false);
          enabled = false;
        }
      } else {
        toast({
          title: "Not supported",
          description: "Your browser doesn't support notifications.",
          variant: "destructive",
        });
        setNotifications(false);
        enabled = false;
      }
    } else {
      toast({
        title: "Notifications disabled",
        description: "You won't receive cycle reminders.",
      });
    }

    handleSettingsChange({ notificationsEnabled: enabled });
  };

  const handleAppLockChange = async (enabled: boolean) => {
    if (enabled) {
      // Set up biometric/PIN authentication
      const result = await setupAppLock();
      if (result.success) {
        setAppLock(true);
        localStorage.setItem('app_lock_type', result.type);
        toast({
          title: "App lock enabled",
          description: `App will be locked using ${result.type === 'biometric' ? 'biometric authentication' : 'PIN'}.`,
        });

        // Set up visibility change listener to lock app when backgrounded
        document.addEventListener('visibilitychange', () => {
          if (document.hidden && enabled) {
            sessionStorage.setItem('app_was_locked', 'true');
          }
        });

        handleSettingsChange({ appLockEnabled: true });
      } else {
        toast({
          title: "Setup failed",
          description: "Could not set up app lock. Please try again.",
          variant: "destructive",
        });
        setAppLock(false);
      }
    } else {
      setAppLock(false);
      localStorage.removeItem('app_lock_type');
      localStorage.removeItem('app_lock_pin');
      sessionStorage.removeItem('app_was_locked');
      toast({
        title: "App lock disabled",
        description: "The app will no longer require authentication.",
      });
      handleSettingsChange({ appLockEnabled: false });
    }
  };

  const handleCycleLengthChange = (length: string) => {
    const numLength = parseInt(length);
    if (isNaN(numLength)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }
    if (numLength >= 21 && numLength <= 45) {
      setCycleLength(length);
      handleSettingsChange({ cycleLength: numLength });
      setEditingCycleLength(false);
      toast({
        title: "Cycle length updated",
        description: `Your cycle length has been set to ${numLength} days.`,
      });
    } else {
      toast({
        title: "Invalid cycle length",
        description: "Please enter a value between 21 and 45 days.",
        variant: "destructive",
      });
    }
  };

  const startEditingCycleLength = () => {
    setTempCycleLength(cycleLength);
    setEditingCycleLength(true);
  };

  const cancelEditingCycleLength = () => {
    setEditingCycleLength(false);
    setTempCycleLength("");
  };







  const menuItems = [
    {
      icon: Mail,
      label: "Email",
      value: userProfile?.email || user?.email || "Loading...",
      type: "display",
    },
    {
      icon: Calendar,
      label: "Cycle length",
      value: `${cycleLength} days`,
      type: "editable",
    },
    {
      icon: Bell,
      label: "Notifications",
      type: "toggle",
      checked: notifications,
      onCheckedChange: handleNotificationChange,
    },
    {
      icon: Settings,
      label: "Theme",
      type: "theme-select",
      value: theme,
      onThemeChange: setTheme,
    },
    {
      icon: Lock,
      label: "App lock",
      type: "toggle",
      checked: appLock,
      onCheckedChange: handleAppLockChange,
      description: "Require authentication to open",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">
          Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </header>

      {/* Profile Card */}
      <main className="px-6 space-y-6">
        <Card variant="cozy" className="animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-foreground">
                  {userProfile?.name || user?.name || "Loading..."}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tracking since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Loading..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {item.type === "display" && (
                  <span className="text-sm text-muted-foreground">
                    {item.value}
                  </span>
                )}

                {item.type === "theme-select" && (
                  <select
                    value={item.value}
                    onChange={(e) => item.onThemeChange(e.target.value as 'light' | 'dark' | 'system')}
                    className="bg-transparent border-none text-sm text-muted-foreground focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                )}

                {item.type === "editable" && item.label === "Cycle length" && (
                  editingCycleLength ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={tempCycleLength}
                        onChange={(e) => setTempCycleLength(e.target.value)}
                        className="w-16 h-8 text-sm"
                        min="21"
                        max="45"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCycleLengthChange(tempCycleLength);
                          } else if (e.key === 'Escape') {
                            cancelEditingCycleLength();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCycleLengthChange(tempCycleLength)}
                        className="h-6 w-6 p-0"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEditingCycleLength}
                        className="h-6 w-6 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <span
                      className="text-sm text-primary font-medium cursor-pointer hover:underline"
                      onClick={startEditingCycleLength}
                    >
                      {item.value}
                    </span>
                  )
                )}

                {item.type === "toggle" && (
                  <Switch
                    checked={item.checked}
                    onCheckedChange={item.onCheckedChange}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>



        {/* Wellness & Data */}
        <Card variant="glass" className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wellness & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
             <div className="flex items-center justify-between py-3 border-b border-border/50 cursor-pointer" onClick={() => navigate('/wellness')}>
               <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                   <Heart className="w-4 h-4 text-foreground" />
                 </div>
                 <div>
                   <p className="font-medium text-foreground">Wellness Goals</p>
                   <p className="text-xs text-muted-foreground">Set health objectives</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-muted-foreground" />
             </div>


          </CardContent>
        </Card>

        {/* Help */}
        <Card variant="interactive" className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => navigate('/help-support')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <span className="font-medium text-foreground">Help & Support</span>
                  <p className="text-xs text-muted-foreground">Get help or contact developer</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete all my data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90%] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your logs, settings, and account data
                  from this device. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full text-muted-foreground">
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90%] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your data will remain on this device. You can sign back in anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Bloom v1.0.0 • Made with 💕
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
