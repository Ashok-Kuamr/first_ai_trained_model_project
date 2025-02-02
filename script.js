let model;
const webcamElement = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Load the Model
async function loadModel() {
    console.log("Loading model...");
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model loaded successfully!");
}

// Start Webcam
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 200, height: 150 } });
        const webcamElement = document.getElementById("webcam");
        webcamElement.srcObject = stream;
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}


// Capture Image from Webcam & Predict
function captureImage() {
    canvas.width = 224;  // Adjust based on your model input size
    canvas.height = 224;
    ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
    predict(canvas);
}

// Run Prediction
// Run Prediction
async function predict(input) {
    if (!model) {
        console.log("Model not loaded yet!");
        return;
    }

    const tensorInput = tf.browser.fromPixels(input)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

    const prediction = model.predict(tensorInput);
    const results = await prediction.data();
    const maxIndex = results.indexOf(Math.max(...results));

    // Convert confidence to percentage (0-100)
    const confidence = (results[maxIndex] * 100).toFixed(2);

    document.getElementById("result").innerText = `Prediction: Class ${maxIndex}, Confidence: ${confidence}%`;
    console.log("Prediction results:", results);
}


// Initialize
loadModel();
startWebcam();
