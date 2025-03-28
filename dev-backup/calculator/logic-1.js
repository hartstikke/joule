function initializeLinkedInputs() {
  const inputRanges = document.querySelectorAll('.linked-input, .linked-range');
  inputRanges.forEach((element) => {
    element.addEventListener('input', updateLinkedValue);
    // Initialize the style on load
    updateLinkedValue.call(element);
  });
}

function updateLinkedValue() {
  const linkedId =
    this.getAttribute('data-linked-input') ||
    this.getAttribute('data-linked-range');
  const linkedElement = document.getElementById(linkedId);
  if (linkedElement) {
    if (this.classList.contains('linked-range')) {
      // Apply the style directly to the range
      const rangeValue =
        ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background = `linear-gradient(to right, #A0E8E3 0%, #A0E8E3 ${rangeValue}%, #F3F3F3 ${rangeValue}%, #F3F3F3 100%)`;
    }
  }
}

initializeLinkedInputs();

document.addEventListener('input', function (event) {
  const target = event.target;
  const linkedAttributeName =
    target.dataset.linkedInput || target.dataset.linkedRange;

  if (linkedAttributeName) {
    const linkedElements = document.querySelectorAll(
      `[data-linked-input="${linkedAttributeName}"], [data-linked-range="${linkedAttributeName}"]`
    );

    linkedElements.forEach((linkedElement) => {
      linkedElement.value = target.value;
      updateLinkedValue.call(linkedElement);
    });
  }
});

const $bikeRetailPrice = document.getElementById('bikeRetailPrice');

// VARIABLES
const submitCalculator = document.getElementById('form-button');
const submitForm = async (e) => {
  e.preventDefault();

  let bikeRetailPrice =
    parseFloat(document.getElementById('bikeRetailPrice').value) / 1.21;
  let accessoriesRetailPrice =
    parseFloat(document.getElementById('accessoriesRetailPrice').value) / 1.21;
  let yearlyMaintenanceFee =
    parseFloat(
      document.querySelector('input[name="yearlyMaintenanceFee"]:checked').value
    ) / 1.21;
  let commuteKilometers = parseFloat(
    document.getElementById('commuteKilometers').value
  );
  let commuteWeeklyFrequency = parseFloat(
    document.getElementById('commuteWeeklyFrequency').value
  );
  let financingMethod = document.querySelector(
    'input[name="financingMethod"]:checked'
  ).value;
  let civilStatus = document.querySelector(
    'input[name="civilStatus"]:checked'
  ).value;
  let dependentChildren = parseFloat(
    document.getElementById('dependentChildren').value
  );
  let grossSalary = parseFloat(
    document.querySelector('#statute-selector .w--tab-active #grossSalary')
      .value
  );
  let computeModel = document.querySelector(
    '#statute-selector .w--tab-active .radio--pc:checked'
  ).value;
  let workingRegimePercent = parseFloat(
    document.querySelector(
      '#statute-selector .w--tab-active .radio--workingregime:checked'
    ).value
  );
  let durationInMonths = parseFloat(
    document.querySelector('input[name="durationInMonths"]:checked').value
  );
  let residualValue = parseFloat(
    document
      .querySelector('input[name="durationInMonths"]:checked')
      .getAttribute('data-residualValue')
  );

  const data = {
    financingMethod: financingMethod,
    grossSalary: grossSalary,
    workingRegimePercent: 1,
    civilStatus: civilStatus,
    workingSpouse: true,
    dependentChildren: dependentChildren,
    commuteKilometers: commuteKilometers,
    commuteWeeklyFrequency: commuteWeeklyFrequency,
    computeModel: computeModel,
    computeLeaseRateDto: {
      bikeRetailPrice: bikeRetailPrice,
      accessoriesRetailPrice: accessoriesRetailPrice,
      discountRate: 0,
      interestRate: 0.077,
      durationInMonths: durationInMonths,
      insurancePremium: 0.035,
      deliveryCost: 50,
      assemblyCost: 117,
      residualValue: residualValue,
      yearlyAdminFee1: 36,
      yearlyAdminFee2: 18.33,
      yearlyMaintenanceFee: yearlyMaintenanceFee,
    },
  };

  console.log(data);

  try {
    const json = await fetch('https://api.offr.be/partners/joule/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-offr-api-key': 'clomvufdi000408i8f7i0gu6t',
      },
      body: JSON.stringify(data),
    });

    const result = await json.json();
    console.log(result);

    document.querySelector('.calculator_default').style.display = 'none';
    document.querySelector('.calculator_result').style.display = 'block';

    window.scrollTo({
      top: document.getElementById('calculator_result-wrapper').offsetTop,
      behavior: 'smooth',
    });

    // Get selected radio button value and determine the percentage
    const term = document.querySelector(
      'input[name="durationInMonths"]:checked'
    ).value;
    const percentages = { 12: 40, 24: 33, 36: 16, 48: 16 };
    const calculatePercentage = percentages[term] / 100 || 0; // Default to 0 if term is not found

    document.querySelector('[data-result="monthlyLeasePrice"]').innerText = (
      result.leasePrice.monthlyLeasePrice * 1.21
    ).toFixed(2);
    document.querySelector('[data-result="maintenanceCost"]').innerText =
      '€ ' + (result.leasePrice.maintenanceCost * 12 * 1.21).toFixed(2);
    document.querySelector('[data-result="servicePackage"]').innerText =
      document
        .querySelector('input[name="yearlyMaintenanceFee"]:checked')
        .getAttribute('data-label');
    document.querySelector('[data-result="durationInMonths"]').innerText =
      document
        .querySelector('input[name="durationInMonths"]:checked')
        .getAttribute('data-label')
        .split(' ')[0];
    document.querySelector('[data-result="beforeLeaseSalaryGross"]').innerText =
      '€ ' + result.beforeLeaseSalary.grossSalary.toFixed(2);
    document.querySelector('[data-result="afterLeaseSalaryGross"]').innerText =
      '€ ' + result.afterLeaseSalary.grossSalary.toFixed(2);
    document.querySelector('[data-result="monthlyGross"]').innerText =
      '€ ' + Math.abs(result.diffs.grossSalary).toFixed(2);
    document.querySelector('[data-result="beforeLeaseSalaryNet"]').innerText =
      '€ ' + result.beforeLeaseSalary.monthlyNetSalary.toFixed(2);
    document.querySelector('[data-result="afterLeaseSalaryNet"]').innerText =
      '€ ' + result.afterLeaseSalary.monthlyNetSalary.toFixed(2);
    document.querySelector('[data-result="monthlyNet"]').innerText =
      '€ ' + Math.abs(result.diffs.monthlyNet.toFixed(2));
    document.querySelector('[data-result="annualNet"]').innerText =
      '€ ' + Math.abs(result.diffs.annualNet.toFixed(2));
    document.querySelector('[data-result="totalNet"]').innerText =
      '€ ' + Math.abs(result.diffs.totalNet.toFixed(2));
    document.querySelector('[data-result="residualValue"]').innerText =
      '€ ' +
      (
        data.computeLeaseRateDto.bikeRetailPrice *
        calculatePercentage *
        1.21
      ).toFixed(2);
    let packageValue =
      bikeRetailPrice +
      accessoriesRetailPrice +
      (data.computeLeaseRateDto.insurancePremium +
        yearlyMaintenanceFee +
        yearlyMaintenanceFee / 12) *
        durationInMonths;
    let savedValue =
      Math.abs(result.leasePrice.totalLeasePrice * 1.21) -
      Math.abs(result.diffs.totalNet) -
      Math.abs(
        data.computeLeaseRateDto.bikeRetailPrice *
          data.computeLeaseRateDto.residualValue
      );
    document.querySelector('[data-result="packageValue"]').innerText =
      '€ ' + Math.abs((result.leasePrice.totalLeasePrice * 1.21).toFixed(2));
    document.querySelector('[data-result="packageValueCalc"]').innerText =
      '€ ' + savedValue.toFixed(2);
    document.querySelector(
      '[data-result="potentialMonthlyBikeAllowance"]'
    ).innerText =
      '€ ' +
      Math.min(
        (
          4 *
          (data.commuteKilometers * 2) *
          data.commuteWeeklyFrequency *
          0.27
        ).toFixed(2),
        625
      );

    // Function to display JSON data in a list inside a div
    function displayJSONResult(data) {
      var resultDiv = document.getElementById('calculator-result');
      resultDiv.innerHTML = '';

      // Create an unordered list
      var ul = document.createElement('ul');

      // Loop through the JSON data and create list items
      for (var category in data) {
        if (data.hasOwnProperty(category)) {
          var li = document.createElement('li');
          li.textContent = category + ': ';

          // Check if the value is an object (subitems)
          if (typeof data[category] === 'object') {
            var subUl = document.createElement('ul');

            // Loop through subitems and create list items
            for (var subItem in data[category]) {
              if (data[category].hasOwnProperty(subItem)) {
                var subLi = document.createElement('li');
                subLi.textContent = subItem + ': ' + data[category][subItem];
                subUl.appendChild(subLi);
              }
            }

            // Append the nested list to the parent list item
            li.appendChild(subUl);
          } else {
            // If not an object, simply append the value to the list item
            li.textContent += data[category];
          }

          // Append the list item to the unordered list
          ul.appendChild(li);
        }
      }

      // Append the list to the result div
      resultDiv.appendChild(ul);
    }

    // Call the function with your JSON data
    displayJSONResult(result);
  } catch (error) {
    console.error(`Error getting output: ${error}`);
    window.alert(`Error getting output: ${error}`);
  }
};

submitCalculator.addEventListener('click', () => {
  if (document.getElementById('bikeRetailPrice').value < 100) {
    //
  } else {
    submitForm();
  }
});

$bikeRetailPrice.addEventListener('input', (e) => {
  let targetValue = e.currentTarget.value;

  if (targetValue < 100) targetValue = 100;
});
