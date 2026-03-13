importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBv50Vg81Y2fzBieR0keQOcLSOYnpAZz0I",
  authDomain: "furniture-website-fcac1.firebaseapp.com",
  projectId: "furniture-website-fcac1",
  messagingSenderId: "404968232396",
  appId: "1:404968232396:web:ae9346ba81f10f7695f969"
});

const messaging = firebase.messaging();