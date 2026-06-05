# Working Process: Maize Guard AI

## System Workflow Summary
Maize Guard AI operates through a seamless integration of a modern web frontend, a high-performance deep learning backend, and a cloud-based conversational artificial intelligence. The system accepts maize leaf images, processes them through a custom Convolutional Neural Network (CNN), and leverages the Google Gemini API to provide instant, actionable agricultural advice.

## Detailed Workflow

**1. User Authentication ➔**  
Users securely register and log into the platform seamlessly using Firebase Authentication, ensuring a personalized and secure session.

**2. Image Acquisition ➔**  
Through the React-based frontend dashboard, the user uploads a photograph of a maize leaf requiring diagnosis via the interactive chatbot interface.

**3. API Transmission ➔**  
The frontend transmits the uploaded image file securely via an HTTP POST request to the FastAPI backend server.

**4. Data Preprocessing ➔**  
The FastAPI backend intercepts the image, resizing it to 224x224 pixels, converting it to RGB format, and normalizing the pixel arrays to match the exact input dimensions required by the neural network.

**5. CNN Model Inference ➔**  
The preprocessed image is fed into a custom-trained TensorFlow/Keras CNN (`.h5` model). The model evaluates the visual features and classifies the leaf into one of four categories: *Blight*, *Common Rust*, *Grey Leaf Spot*, or *Healthy*.

**6. Diagnostic Response ➔**  
The backend determines the highest probability class and returns the primary prediction, along with a statistical confidence score to the frontend.

**7. LLM Enrichment (Gemini API) ➔**  
The React frontend forwards the CNN’s baseline diagnosis to the Google Gemini API. Gemini dynamically generates context-aware, comprehensive treatment protocols, prevention strategies, and farming recommendations tailored to the specific identified disease.

**8. Data Persistence ➔**  
The complete diagnostic report—comprising the image URL, CNN prediction, confidence score, and Gemini’s detailed treatment plan—is persistently stored in Firebase Firestore under the user's historical records.

**9. Result Visualization ➔**  
The final, enriched diagnostic report is rendered dynamically within the interactive chatbot UI, providing the user with an intuitive, readable, and actionable agricultural assessment.
