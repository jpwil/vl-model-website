// Medical Risk Calculator JavaScript

// DOM elements
const form = document.getElementById("risk-calculator-form");
const dobInput = document.getElementById("dob");
const calculatedAge = document.getElementById("calculated-age");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.querySelector(".btn-text");
const btnLoader = document.getElementById("btn-loader");
const resultSection = document.getElementById("result-section");
const riskPercentage = document.getElementById("risk-percentage");
const riskInterpretation = document.getElementById("risk-interpretation");

// Utility functions

// Formula for risk calculation
function calculateRisk(data) {
  // This is a placeholder formula - replace with your actual formula
  let risk = 0;

  // Age factor (higher risk for very young and older patients)
  if (data.age < 5) {
    risk += 20;
  } else if (data.age > 65) {
    risk += 15;
  } else {
    risk += data.age * 0.3;
  }

  // Anaemia factor
  if (data.anaemia === "yes") {
    risk += 25;
  }

  // Haemoglobin factor (inverse relationship)
  const hbFactor = Math.max(0, (150 - data.haemoglobin) * 0.2);
  risk += hbFactor;

  // Parasite count factor
  if (data.parasiteCount !== "not-available") {
    risk += parseInt(data.parasiteCount) * 5;
  }

  // Ensure risk is between 0 and 100
  risk = Math.min(100, Math.max(0, risk));

  return Math.round(risk * 10) / 10; // Round to 1 decimal place
}

function getRiskInterpretation(riskValue) {
  if (riskValue < 20) {
    return {
      text: "Low risk - Standard monitoring recommended",
      class: "low-risk",
    };
  } else if (riskValue < 50) {
    return {
      text: "Moderate risk - Enhanced monitoring advised",
      class: "medium-risk",
    };
  } else {
    return {
      text: "High risk - Immediate clinical attention required",
      class: "high-risk",
    };
  }
}

function showLoadingState() {
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;
}

function hideLoadingState() {
  submitBtn.classList.remove("loading");
  submitBtn.disabled = false;
}

function displayResult(riskValue) {
  const interpretation = getRiskInterpretation(riskValue);

  // Update result display
  riskPercentage.textContent = `${riskValue}%`;
  riskPercentage.className = `risk-percentage ${interpretation.class}`;
  riskInterpretation.textContent = interpretation.text;

  // Show result section
  resultSection.classList.add("active");

  // Smooth scroll to results
  resultSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function validateForm(formData) {
  const errors = [];

  // Check if date of birth is provided and reasonable
  if (!formData.dob) {
    errors.push("Date of birth is required");
  } else {
    const age = calculateAge(formData.dob);
    if (age < 0) {
      errors.push("Date of birth cannot be in the future");
    }
    if (age > 120) {
      errors.push("Please check the date of birth - age seems unrealistic");
    }
  }

  // Check anaemia selection
  if (!formData.anaemia) {
    errors.push("Please select anaemia status");
  }

  // Check haemoglobin range
  if (!formData.haemoglobin) {
    errors.push("Haemoglobin level is required");
  } else {
    const hb = parseFloat(formData.haemoglobin);
    if (hb < 20 || hb > 180) {
      errors.push("Haemoglobin must be between 20-180 g/L");
    }
  }

  // Check parasite count
  if (!formData.parasiteCount) {
    errors.push("Please select parasite count");
  }
  return errors;
}

function showValidationErrors(errors) {
  // Simple alert for now - you could enhance this with better UI
  alert("Please correct the following errors:\n\n" + errors.join("\n"));
}

// Form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(form);
  const data = {
    dob: formData.get("dob"),
    age: formData.get("dob") ? calculateAge(formData.get("dob")) : null,
    anaemia: formData.get("anaemia"),
    haemoglobin: formData.get("haemoglobin"),
    parasiteCount: formData.get("parasite-count"),
  };

  // Validate form
  const errors = validateForm(data);
  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  // Show loading state
  showLoadingState();

  try {
    // Simulate API call delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate risk
    const riskValue = calculateRisk(data);

    // Display result
    displayResult(riskValue);
  } catch (error) {
    console.error("Error calculating risk:", error);
    alert("An error occurred while calculating risk. Please try again.");
  } finally {
    // Hide loading state
    hideLoadingState();
  }
});

// Form input animations and interactions
const inputs = form.querySelectorAll("input, select");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.classList.add("focused");
  });

  input.addEventListener("blur", function () {
    this.parentElement.classList.remove("focused");
  });
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Set max date to today for date of birth
  const today = new Date().toISOString().split("T")[0];
  dobInput.setAttribute("max", today);

  console.log("Medical Risk Calculator initialized");
});
