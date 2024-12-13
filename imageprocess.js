async function processImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    // Load and resize the image
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
        canvas.width = 224; // Model's input size
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);

        // Convert image to tensor
        const tensor = tf.browser.fromPixels(canvas)
            .toFloat()
            .div(255.0)
            .expandDims();

        // Make prediction
        const predictions = await model.predict(tensor).data();
        const classes = ["Healthy", "Blight", "Rust", "Powdery Mildew"]; // Add all class names

        // Find the highest probability
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const result = classes[maxIndex];
        const confidence = (predictions[maxIndex] * 100).toFixed(2);

        document.getElementById('predictionResult').innerHTML = `
            <h3>Prediction: ${result}</h3>
            <p>Confidence: ${confidence}%</p>
        `;
    };
}


async function getDiseaseInfo(diseaseName) {
    const response = await fetch('data/diseaseInfo.json');
    const data = await response.json();
    const diseaseInfo = data[diseaseName];

    if (diseaseInfo) {
        document.getElementById('predictionResult').innerHTML += `
            <h4>Description:</h4>
            <p>${diseaseInfo.description}</p>
            <h4>Symptoms:</h4>
            <ul>${diseaseInfo.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
            <h4>Remedies:</h4>
            <ul>${diseaseInfo.remedies.map(r => `<li>${r}</li>`).join('')}</ul>
        `;
    } else {
        document.getElementById('predictionResult').innerHTML += `<p>No additional information available.</p>`;
    }
}
