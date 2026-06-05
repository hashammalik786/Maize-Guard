# 🌽 Maize Guard AI

## AI-Powered Maize Disease Detection & Agricultural Assistance Platform

Maize Guard AI is an intelligent web-based agricultural system designed to help farmers identify maize leaf diseases using Artificial Intelligence. The platform combines Deep Learning, Computer Vision, and Generative AI to provide instant disease diagnosis and actionable recommendations.

---

## 📌 Overview

Maize Guard AI allows users to upload images of maize leaves and receive AI-powered disease predictions. The system uses a trained Convolutional Neural Network (CNN) model for image classification and Google Gemini AI for conversational agricultural guidance.

The platform aims to improve crop health monitoring, reduce disease-related losses, and provide accessible agricultural support.

---

## 🚀 Features

### 🔐 User Authentication

* Secure user registration and login
* Firebase Authentication integration
* Personalized user dashboard

### 🌽 Disease Detection

* Upload maize leaf images
* Automatic image preprocessing
* Deep learning prediction using trained CNN model
* Confidence-based disease classification

### 🤖 AI Agricultural Assistant

* Powered by Google Gemini AI
* Provides disease explanations
* Treatment recommendations
* Prevention strategies
* Farming guidance and best practices

### ☁️ Cloud Storage

* Firebase Storage integration
* Secure image uploads
* Disease history management

### 📊 Prediction History

* Stores previous diagnoses
* Track crop health over time
* User-specific records

---

## 🏗 System Architecture

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Firebase SDK

### Backend

* Python
* FastAPI
* TensorFlow / Keras
* NumPy
* Pillow (PIL)

### Database & Cloud Services

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

### Artificial Intelligence

* Custom CNN Model (.h5)
* Google Gemini API

---

## 🔄 Workflow

1. User signs in through Firebase Authentication.
2. User uploads a maize leaf image.
3. React frontend sends the image to FastAPI backend.
4. Backend preprocesses the image.
5. TensorFlow CNN model predicts the disease.
6. Prediction results are returned to the frontend.
7. Gemini AI generates recommendations and explanations.
8. Results are stored in Firebase for future reference.

---

## 🌱 Supported Disease Classes

The trained model currently identifies:

* Healthy
* Common Rust
* Gray Leaf Spot
* Blight

---

## 📂 Project Structure

```bash
Maize-Guard/
│
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── firebase/
│   ├── services/
│   ├── App.js
│   └── main.jsx
│
├── backend/
│   ├── main.py
│   ├── maize_model.h5
│   └── requirements.txt
│
├── package.json
├── README.md
└── .env
```

---

## 🧠 Machine Learning Model

The disease detection system uses a Convolutional Neural Network (CNN) trained on maize leaf datasets.

### Input

* RGB Leaf Image
* Resized to 224 × 224 pixels

### Output

* Disease Class
* Confidence Score


---



## 📸 Example Usage

1. Login to the platform.
2. Upload a maize leaf image.
3. Receive disease prediction.
4. View confidence score.
5. Ask questions through AI assistant.
6. Save results for future reference.

---

## 🎯 Objectives

* Early disease detection
* Improved crop management
* AI-assisted farming decisions
* Increased agricultural productivity
* Accessible plant health diagnostics

---

## 🔒 Security

* Firebase Authentication
* Protected user data
* Secure API communication
* Cloud-based storage management

---

## 🌍 Future Improvements

* Mobile application support
* Multi-language assistance
* Additional crop disease detection
* Offline image analysis
* Real-time farmer alerts
* Advanced analytics dashboard

---



---

## 📄 License

This project is developed for educational and research purposes.
