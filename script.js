document.querySelector('.take-picture').addEventListener('click', function() {
  alert('Picture taken!');
});

document.querySelectorAll('.feature-button').forEach(button => {
  button.addEventListener('click', function() {
      alert('Feature coming soon!');
  });
});

const currentDate = new Date();
document.getElementById("current-date").innerHTML = `Today, ${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "long" })}`;

// Get current weather
fetch("https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric")
  .then((response) => response.json())
  .then((data) => {
      document.getElementById("current-temp").innerHTML = `${data.main.temp}°C`;
      document.getElementById("weather-details").innerHTML = `${data.weather[0].description} · ${data.main.temp_max}°C / ${data.main.temp_min}°C`;
      document.getElementById("weather-icon").innerHTML = `&#x${data.weather[0].icon};`;
  })
  .catch((error) => console.error("Error:", error));

const CONFIG = {
  crops: [
      { name: 'Banana', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop' },
      { name: 'Rice', image: 'https://images.unsplash.com/photo-1536304447766-da0ed4ce1b73?w=800&auto=format&fit=crop' },
      { name: 'Wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop' },
      { name: 'Maize', image: 'https://images.unsplash.com/photo-1601593768799-76e1c566e857?w=800&auto=format&fit=crop' },
      { name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop' }
  ],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp']
};

document.addEventListener('DOMContentLoaded', () => {
  const cropList = document.getElementById('cropList');
  CONFIG.crops.forEach(crop => {
      const cropElement = document.createElement('div');
      cropElement.className = 'crop-item';

      const img = document.createElement('img');
      img.src = crop.image;
      img.alt = crop.name;
      img.loading = 'lazy';

      cropElement.appendChild(img);
      cropList.appendChild(cropElement);
  });

  const imageInput = document.getElementById('imageInput');
  const uploadArea = document.getElementById('uploadArea');
  const previewArea = document.getElementById('previewArea');
  const previewImage = document.getElementById('previewImage');
  const diagnosisResult = document.getElementById('diagnosisResult');

  imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
          if (CONFIG.allowedImageTypes.includes(file.type) && file.size <= CONFIG.maxImageSize) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  previewImage.src = e.target.result;
                  previewArea.hidden = false;
                  uploadArea.querySelector('.upload-placeholder').hidden = true;
                  analyzeImage(file);
              };
              reader.readAsDataURL(file);
          } else {
              alert('Invalid file type or size exceeded!');
          }
      }
  });

  function analyzeImage(file) {
      diagnosisResult.innerHTML = 'Analyzing image...';
      setTimeout(() => {
          const diagnosis = {
              disease: 'Leaf Blight',
              confidence: 0.92,
              description: 'This fungal disease affects the leaves causing brown spots and wilting.',
              treatment: 'Apply copper-based fungicide and ensure proper air circulation between plants.'
          };
          displayResult(diagnosis);
      }, 2000);
  }

  function displayResult(diagnosis) {
      diagnosisResult.innerHTML = `
          <h3>Diagnosis Result</h3>
          <p><strong>${diagnosis.disease}</strong> detected (${Math.round(diagnosis.confidence * 100)}% confidence)</p>
          <p>${diagnosis.description}</p>
          <p><strong>Recommended Treatment:</strong> ${diagnosis.treatment}</p>
      `;
  }
});
document.getElementById('imageInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewImage').src = e.target.result;
      document.getElementById('previewArea').hidden = false; // Show the preview area
      document.getElementById('uploadArea').querySelector('.upload-placeholder').hidden = true; // Hide the upload placeholder
    }
    reader.readAsDataURL(file);
  }
});

let model;

// Load the model
async function loadModel() {
    model = await tf.loadGraphModel('assets/model/model.json'); // Update the path if hosted elsewhere
    console.log('Model loaded successfully!');
}

loadModel();
function preprocessImage(imageElement) {
  return tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Resize to match model input
      .toFloat()
      .div(255.0) // Normalize pixel values
      .expandDims(0); // Add batch dimension
}
async function predict(inputTensor) {
  const predictions = await model.predict(inputTensor).data();
  console.log('Predictions:', predictions);
}

