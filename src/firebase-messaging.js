import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

console.log("firebase-messaging module loaded");

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service worker registered:", registration.scope);

    const token = await getToken(messaging, {
      vapidKey:
        "BF-5fKqO78MTqgJUx4Ty5trC44N1Y0NcjhZMpzoCbx860RS_LizPRuDT5YuRRgu5nVEXwtCymKhrbVBG44x6f38",
      serviceWorkerRegistration: registration
    });
    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.warn("No FCM token retrieved");
    }
    return token;
  } catch (error) {
    console.error("Error getting token", error);
    return null;
  }
};