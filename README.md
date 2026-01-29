<p align="center">
  <img src="assets/images/hand2voice-banner.png" alt="Hand2Voice Banner" width="100%" />
</p>

# 🤟 Hand2Voice | SignLink AI App

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-blue)
![AI](https://img.shields.io/badge/AI-TensorFlow%20Lite-orange)
![ISL](https://img.shields.io/badge/Sign%20Language-Indian%20Sign%20Language-green)
![Status](https://img.shields.io/badge/status-Prototype-success)
![Open Source](https://img.shields.io/badge/open%20source-yes-brightgreen)

> **An AI-powered mobile application that bridges Indian Sign Language (ISL) with Text and Voice to enable inclusive communication for the deaf and mute community.**

---

## 🌟 Project Overview

**Hand2Voice (SignLink AI)** is a mobile-first, AI-driven communication platform designed to reduce the communication gap between **deaf, mute, and hearing individuals**.

Most existing sign language applications focus on **American Sign Language (ASL)**.  
Hand2Voice uniquely focuses on **Indian Sign Language (ISL)** and enables **real-time, two-way communication** between sign language, text, and voice.

---

## 🧠 Problem Statement

- Lack of real-time Indian Sign Language translation tools  
- Most solutions are ASL-focused, not ISL  
- Communication barriers in education, healthcare, and workplaces  
- High dependency on human interpreters  

---

## 🚀 Key Features

✅ Real-time **Sign → Text** translation using AI  
✅ **Text / Voice → Sign** animations (GIFs / visuals)  
✅ Alphabet learning module (A–Z signs)  
✅ Multi-language **Text-to-Speech** support  
✅ Firebase authentication & cloud storage  
✅ Clean, accessible, mobile-friendly UI  

---

## 📱 App Screenshots

> 📌 Upload screenshots inside `assets/images/`

<table>
  <tr>
    <td align="center"><b>Onboarding</b></td>
    <td align="center"><b>Sign to Text</b></td>
    <td align="center"><b>Text to Sign</b></td>
    <td align="center"><b>Text to Voice</b></td>
    <td align="center"><b>Learn the sign</b></td>
  </tr>
  <tr>
    <td><img src="assets/images/page 1.jpeg" width="220"/></td>
    <td><img src="assets/images/signtotext.png" width="220"/></td>
    <td><img src="assets/images/page 2.jpeg" width="220"/></td>
    <td><img src="assets/images/page 3.jpg" width="220"/></td>
     <td><img src="assets/images/page 4.jpeg" width="220"/></td>
  </tr>
</table>

---

## 📁 Project Structure

```
Hand2Voice/
├── app/                          → React Native (Expo) screens
│   └── prototype/                → App features (Sign/Text/Voice)
├── assets/                       → Images, videos, sign assets
│   ├── images/
│   ├── alphabet/
│   └── video/
├── SignLanguageDetectionUsingML/ → ML training & gesture detection
│   ├── trainmodel.py
│   ├── collectdata.py
│   ├── model.h5
│   └── MP_Data/
├── model_conversion/             → Model to TFLite conversion
├── text to voices/               → Text-to-Speech backend
├── firebaseConfig.js             → Firebase configuration
├── app.json                      → Expo configuration
└── README.md
```

---

## 🔄 System Architecture

```
Mobile App (Expo)
        ↓
Firebase (Auth + Storage)
        ↓
AI Model (TensorFlow Lite)
        ↓
Text / Voice / Sign Output
```

---

## 🎬 App Demo (Optional but Highly Recommended)

![Hand2Voice Demo](assets/video/hand2voice-demo.gif)

---

## 💻 Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **AI / ML**: TensorFlow, MediaPipe, TFLite
- **Animations**: LottieFiles / GIFs
- **Platforms**: Android, iOS, Web

---

## 📖 Getting Started

> Documentation coming soon...

---

## 🤝 Contributing

We welcome contributions! Feel free to submit pull requests or open issues.

---

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by the Hand2Voice Team**
