const crops = [
    { name: "Banana", price: 0 , icon: "🍌" },
    { name: "Bitter Gourd", price: 0, icon: "🥒" },
    { name: "Black & Green", price: 0, icon: "🌿" },
    { name: "Brinjal", price: 0, icon: "🍆" },
    { name: "Cabbage", price: 0, icon: "🥬" },
    { name: "Capsicum", price: 0, icon: "🌶️" },
    { name: "Carrot", price: 0, icon: "🥕" },
    { name: "Bean", price: 0, icon: "🫘" },
  ];
  
  const cropsList = document.getElementById("crops-list");
  
  // Dynamically create crop list items
  crops.forEach(crop => {
    const li = document.createElement("li");
  
    const cropName = document.createElement("div");
    cropName.classList.add("crop-name");
    cropName.innerHTML = `<span>${crop.icon}</span> ${crop.name}`;
  
    const cropPrice = document.createElement("span");
    cropPrice.classList.add("crop-price");
    cropPrice.textContent = `₹${crop.price}`;
  
    li.appendChild(cropName);
    li.appendChild(cropPrice);
  
    cropsList.appendChild(li);
  });
  