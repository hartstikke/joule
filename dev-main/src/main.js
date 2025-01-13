/* --------------- SCRIPT START --------------- */
function main() {
  function initializeLinkedInputs() {
    const inputRanges = document.querySelectorAll('.linked-input, .linked-range')
    inputRanges.forEach((element) => {
      element.addEventListener('input', updateLinkedValue)
      // Initialize the style on load
      updateLinkedValue.call(element)
    })
  }

  function updateLinkedValue() {
    const linkedId = this.getAttribute('data-linked-input') || this.getAttribute('data-linked-range')
    const linkedElement = document.getElementById(linkedId)
    if (linkedElement) {
      if (this.classList.contains('linked-range')) {
        // Apply the style directly to the range
        const rangeValue = ((this.value - this.min) / (this.max - this.min)) * 100
        this.style.background = `linear-gradient(to right, #A0E8E3 0%, #A0E8E3 ${rangeValue}%, #F3F3F3 ${rangeValue}%, #F3F3F3 100%)`
      }
    }
  }

  initializeLinkedInputs()

  document.addEventListener('input', function (event) {
    const target = event.target
    const linkedAttributeName = target.dataset.linkedInput || target.dataset.linkedRange

    if (linkedAttributeName) {
      const linkedElements = document.querySelectorAll(`[data-linked-input="${linkedAttributeName}"], [data-linked-range="${linkedAttributeName}"]`)

      linkedElements.forEach((linkedElement) => {
        linkedElement.value = target.value
        updateLinkedValue.call(linkedElement)
      })
    }
  })

  const $bikeRetailPrice = document.getElementById('bikeRetailPrice')

  // VARIABLES
  const submitCalculator = document.getElementById('form-button')
  const submitForm = async (e) => {
    e.preventDefault()
    // VALUES
    let bikeRetailPrice = parseFloat(document.getElementById('bikeRetailPrice').value) / 1.21
    let accessoriesRetailPrice = parseFloat(document.getElementById('accessoriesRetailPrice').value) / 1.21
    let yearlyMaintenanceFee = parseFloat(document.querySelector('input[name="yearlyMaintenanceFee"]:checked').value) / 1.21
    let commuteKilometers = parseFloat(document.getElementById('commuteKilometers').value)
    let commuteWeeklyFrequency = parseFloat(document.getElementById('commuteWeeklyFrequency').value)
    let financingMethod = document.querySelector('input[name="financingMethod"]:checked').value
    let civilStatus = document.querySelector('input[name="civilStatus"]:checked').value
    let dependentChildren = parseFloat(document.getElementById('dependentChildren').value)
    let grossSalary = parseFloat(document.querySelector('#statute-selector .w--tab-active #grossSalary').value)
    let computeModel = document.querySelector('#statute-selector .w--tab-active .radio--pc:checked').value
    let durationInMonths = parseFloat(document.querySelector('input[name="durationInMonths"]:checked').value)
    let residualValue = parseFloat(document.querySelector('input[name="durationInMonths"]:checked').getAttribute('data-residualValue'))

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
    }

    console.log(data)

    try {
      const json = await fetch('https://api.offr.be/partners/joule/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-offr-api-key': 'clomvufdi000408i8f7i0gu6t',
        },
        body: JSON.stringify(data),
      })

      const r = await json.json()

      if (r) {
        // document.querySelector('.calculator_switcher_component').classList.remove('hide')
        // setIntroText('simple')
        document.querySelector('.calculator_default').classList.add('hide')
      }
      console.log(r)

      document.querySelector('.calculator_result').style.display = 'block'

      window.scrollTo({
        top: document.getElementById('calculator_result-wrapper').offsetTop,
        behavior: 'smooth',
      })

      const term = document.querySelector('input[name="durationInMonths"]:checked').value
      const percentages = { 12: 40, 24: 33, 36: 16, 48: 16 }
      const calculatePercentage = percentages[term] / 100 || 0

      const setValue = (el, resultText, multiple) => {
        if (multiple) {
          const thisEl = document.querySelectorAll(`[data-result="${el}"`)

          thisEl.forEach((element) => (element.innerText = `${element.hasAttribute('data-prefix') ? '€' + resultText : resultText}`))
        } else {
          const thisEl = document.querySelector(`[data-result="${el}"`)

          if (thisEl) {
            thisEl.innerText = `${thisEl.hasAttribute('data-prefix') ? '€' + resultText : resultText}`
          }
        }
      }

      let monthlyLeasePriceNumber = r.leasePrice.monthlyLeasePrice * 1.21
      // Advantage
      const beforeEmployerCostTotal =
        r.beforeLeaseSalary.employerCosts.otherExpenses + r.beforeLeaseSalary.employerCosts.socialSecurityContributions + r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction
      const afterEmployerCostTotal =
        r.afterLeaseSalary.employerCosts.otherExpenses + r.afterLeaseSalary.employerCosts.socialSecurityContributions + r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction
      let advantagePerMonthNumber = (beforeEmployerCostTotal - afterEmployerCostTotal) / 12

      if (financingMethod === 'BONUS') {
        console.log('true')
        advantagePerMonthNumber = beforeEmployerCostTotal - afterEmployerCostTotal
        document.querySelectorAll('[data-bonus="show"]').forEach((el) => el.classList.remove('hide'))
        document.querySelectorAll('[data-bonus="hide"]').forEach((el) => el.classList.add('hide'))
        monthlyLeasePriceNumber = monthlyLeasePriceNumber * 12
      }

      document.querySelectorAll('[data-result="monthlyLeasePrice"]').forEach((monthlyLeasePrice) => (monthlyLeasePrice.innerText = monthlyLeasePriceNumber.toFixed(0)))
      document.querySelector('[data-result="maintenanceCost"]').innerText = '€ ' + (r.leasePrice.maintenanceCost * 12 * 1.21).toFixed(0)
      document.querySelector('[data-result="servicePackage"]').innerText = document.querySelector('input[name="yearlyMaintenanceFee"]:checked').getAttribute('data-label')
      document.querySelector('[data-result="durationInMonths"]').innerText = document.querySelector('input[name="durationInMonths"]:checked').getAttribute('data-label').split(' ')[0]

      // Sociale zekerheid
      setValue(
        'beforeSocialSecurity',
        Math.abs(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction.toFixed(0)) == 0
          ? '€0'
          : '- €' + Math.abs(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction.toFixed(0))
      )
      setValue(
        'afterSocialSecurity',
        Math.abs(r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction.toFixed(0)) == 0
          ? '€0'
          : '- €' + Math.abs(r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction.toFixed(0))
      )

      // Other Costs
      setValue('beforeOtherExpenses', r.beforeLeaseSalary.employerCosts.otherExpenses.toFixed(0) == 0 ? '€0' : '- €' + r.beforeLeaseSalary.employerCosts.otherExpenses.toFixed(0))
      setValue('afterOtherExpenses', r.afterLeaseSalary.employerCosts.otherExpenses.toFixed(0) == 0 ? '€0' : '- €' + r.afterLeaseSalary.employerCosts.otherExpenses.toFixed(0))
      /**
       *
       *
       *
       *
       *
       */

      setValue('advantage', advantagePerMonthNumber.toFixed(0), true)
      setValue('recoup', monthlyLeasePriceNumber.toFixed(0) - advantagePerMonthNumber.toFixed(0), true)

      setValue('beforeEmployerTotal', beforeEmployerCostTotal.toFixed(0) == 0 ? '€0' : `- €${beforeEmployerCostTotal.toFixed(0)}`)
      setValue('afterEmployerTotal', afterEmployerCostTotal.toFixed(0) == 0 ? '€0' : `- €${afterEmployerCostTotal.toFixed(0)}`)

      setValue('savedTotalYearly', `€${(beforeEmployerCostTotal - afterEmployerCostTotal).toFixed(0)}`)

      /**
       *
       *
       *
       */

      // Bruto salaris - Gross Salary
      setValue('beforeLeaseSalaryGross', '€' + r.beforeLeaseSalary.grossSalary.toFixed(0))
      setValue('afterLeaseSalaryGross', '€' + r.afterLeaseSalary.grossSalary.toFixed(0))

      // RSZ
      setValue('beforeSocialSecurityContributions', r.beforeLeaseSalary.socialSecurityContributions.toFixed(0) == 0 ? '€0' : '- €' + r.beforeLeaseSalary.socialSecurityContributions.toFixed(0))
      setValue(
        'beforeSpecialSocialSecurityContributions',
        r.beforeLeaseSalary.specialSocialSecurityContributions.toFixed(0) == 0 ? '€0' : '- €' + r.beforeLeaseSalary.specialSocialSecurityContributions.toFixed(0)
      )

      setValue('afterSocialSecurityContributions', r.afterLeaseSalary.socialSecurityContributions.toFixed(0) == 0 ? '€0' : '- €' + r.afterLeaseSalary.socialSecurityContributions.toFixed(0))
      setValue(
        'afterSpecialSocialSecurityContributions',
        r.afterLeaseSalary.specialSocialSecurityContributions.toFixed(0) == 0 ? '€0' : '- €' + r.afterLeaseSalary.specialSocialSecurityContributions.toFixed(0)
      )

      // Workbonus
      setValue('beforeWorkBonus', '€' + r.beforeLeaseSalary.workBonus.toFixed(0))
      setValue('afterWorkBonus', '€' + r.afterLeaseSalary.workBonus.toFixed(0))

      // Taxable Income
      setValue('beforeTaxableIncome', '€' + r.beforeLeaseSalary.taxableIncome.toFixed(0))
      setValue('afterTaxableIncome', '€' + r.afterLeaseSalary.taxableIncome.toFixed(0))

      // Income Tax
      setValue('beforeIncomeTax', r.beforeLeaseSalary.incomeTaxes.toFixed(0) == 0 ? '€0' : '- €' + r.beforeLeaseSalary.incomeTaxes.toFixed(0))
      setValue('afterIncomeTax', r.afterLeaseSalary.incomeTaxes.toFixed(0) == 0 ? '€0' : '- €' + r.afterLeaseSalary.incomeTaxes.toFixed(0))

      // Leaseprijs per maand/jaar
      setValue('monthlyNet', '€' + Math.abs(r.diffs.monthlyNet.toFixed(2)))
      // setValue('annualNet', '€' + Math.abs(r.diffs.annualNet.toFixed(2)))

      document.querySelector('[data-result="totalNet"]').innerText = '€ ' + Math.abs(r.diffs.totalNet.toFixed(0))
      document.querySelector('[data-result="residualValue"]').innerText = '€ ' + (data.computeLeaseRateDto.bikeRetailPrice * calculatePercentage * 1.21).toFixed(0)

      let fietsVergoeding = document.querySelector('#fietsVergoeding').value || 0.27

      let savedValue = Math.abs(r.leasePrice.totalLeasePrice * 1.21) - Math.abs(r.diffs.totalNet) - Math.abs(data.computeLeaseRateDto.bikeRetailPrice * data.computeLeaseRateDto.residualValue)
      document.querySelector('[data-result="packageValue"]').innerText = '€ ' + Math.abs((r.leasePrice.totalLeasePrice * 1.21).toFixed(0))
      document.querySelector('[data-result="packageValueCalc"]').innerText = '€ ' + savedValue.toFixed(0)
      document.querySelector('[data-result="potentialMonthlyBikeAllowance"]').innerText =
        '€ ' + Math.min((4 * (data.commuteKilometers * 2) * data.commuteWeeklyFrequency * fietsVergoeding).toFixed(0), 625)
    } catch (error) {
      console.error(`Error getting output: ${error}`)
      window.alert(`Error getting output: ${error}`)
    }
  }
  submitCalculator.addEventListener('click', submitForm)

  $bikeRetailPrice.addEventListener('blur', (e) => {
    let targetValue = e.currentTarget.value
    console.log(targetValue)

    if (targetValue < 605) {
      setTimeout(() => {
        $bikeRetailPrice.value = 605
      }, 50)
    }
  })

  document.addEventListener('change', function (event) {
    // Check if the changed element is a radio button inside .calculator_radio-block
    if (event.target.type === 'radio' && event.target.closest('.calculator_radio-block')) {
      const radioName = event.target.name

      // Remove 'checked' class from .calculator_radio-block instances with the same name attribute
      document.querySelectorAll(`.calculator_radio-block input[type="radio"][name="${radioName}"]`).forEach(function (radio) {
        radio.closest('.calculator_radio-block').classList.remove('checked')
      })

      // Add 'checked' class to the label of the checked radio button
      event.target.closest('.calculator_radio-block').classList.add('checked')
    }
  })
}

main()
/* --------------- SCRIPT END --------------- */
