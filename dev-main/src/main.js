// Constants
const API_CONFIG = {
  URL: 'https://api.offr.be/partners/joule/calculate',
  KEY: 'clomvufdi000408i8f7i0gu6t',
}

const TERM_PERCENTAGES = {
  12: 0.4,
  24: 0.33,
  36: 0.16,
  48: 0.16,
}
console.log('test')

let term = document.querySelector('input[name="durationInMonths"]:checked').value

const MIN_BIKE_PRICE = 605
const VAT_RATE = 1.21

class CalculatorApp {
  constructor() {
    this.initializeElements()
    this.setupEventListeners()
    this.originalButtonText = this.submitCalculator.textContent // Store original button text
  }

  initializeElements() {
    this.submitCalculator = document.getElementById('form-button')
    this.bikeRetailPrice = document.getElementById('bikeRetailPrice')
    this.calculatorResult = document.querySelector('.calculator_result')
    this.calculatorDefault = document.querySelector('.calculator_default')
    this.resultWrapper = document.getElementById('calculator_result-wrapper')
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitCalculator.textContent = 'Calculating...'
      this.submitCalculator.disabled = true
    } else {
      this.submitCalculator.textContent = this.originalButtonText
      this.submitCalculator.disabled = false
    }
  }

  setupEventListeners() {
    this.submitCalculator.addEventListener('click', this.handleSubmit.bind(this))
    this.bikeRetailPrice.addEventListener('blur', this.validateBikePrice.bind(this))
    this.initializeLinkedInputs()
    this.setupRadioChangeListener()
  }

  initializeLinkedInputs() {
    const inputRanges = document.querySelectorAll('.linked-input, .linked-range')
    inputRanges.forEach((element) => {
      element.addEventListener('input', this.updateLinkedValue)
      this.updateLinkedValue.call(element)
    })

    document.addEventListener('input', this.handleLinkedInputs.bind(this))
  }

  updateLinkedValue() {
    const linkedId = this.dataset.linkedInput || this.dataset.linkedRange
    if (this.classList.contains('linked-range')) {
      const rangeValue = ((this.value - this.min) / (this.max - this.min)) * 100
      this.style.background = `linear-gradient(to right, #A0E8E3 0%, #A0E8E3 ${rangeValue}%, #F3F3F3 ${rangeValue}%, #F3F3F3 100%)`
    }
  }

  handleLinkedInputs(event) {
    const { target } = event
    const linkedAttributeName = target.dataset.linkedInput || target.dataset.linkedRange

    if (linkedAttributeName) {
      const linkedElements = document.querySelectorAll(`[data-linked-input="${linkedAttributeName}"], [data-linked-range="${linkedAttributeName}"]`)
      linkedElements.forEach((element) => {
        element.value = target.value
        this.updateLinkedValue.call(element)
      })
    }
  }

  validateBikePrice(event) {
    const value = Number(event.currentTarget.value)
    if (value < MIN_BIKE_PRICE) {
      setTimeout(() => {
        event.currentTarget.value = MIN_BIKE_PRICE
      }, 50)
    }
  }

  setupRadioChangeListener() {
    document.addEventListener('change', (event) => {
      if (event.target.type === 'radio' && event.target.closest('.calculator_radio-block')) {
        const radioName = event.target.name
        const radioBlocks = document.querySelectorAll(`.calculator_radio-block input[type="radio"][name="${radioName}"]`)

        radioBlocks.forEach((radio) => radio.closest('.calculator_radio-block').classList.remove('checked'))
        event.target.closest('.calculator_radio-block').classList.add('checked')
      }
    })
  }

  getFormData() {
    const activeStatute = document.querySelector('#statute-selector .w--tab-active')
    const selectedDuration = document.querySelector('input[name="durationInMonths"]:checked')

    return {
      financingMethod: document.querySelector('input[name="financingMethod"]:checked').value,
      grossSalary: parseFloat(activeStatute.querySelector('#grossSalary').value),
      workingRegimePercent: 1,
      civilStatus: document.querySelector('input[name="civilStatus"]:checked').value,
      workingSpouse: true,
      dependentChildren: parseFloat(document.getElementById('dependentChildren').value),
      commuteKilometers: parseFloat(document.getElementById('commuteKilometers').value),
      commuteWeeklyFrequency: parseFloat(document.getElementById('commuteWeeklyFrequency').value),
      computeModel: activeStatute.querySelector('.radio--pc:checked').value,
      computeLeaseRateDto: {
        bikeRetailPrice: parseFloat(this.bikeRetailPrice.value) / VAT_RATE,
        accessoriesRetailPrice: parseFloat(document.getElementById('accessoriesRetailPrice').value) / VAT_RATE,
        discountRate: 0,
        interestRate: 0.077,
        durationInMonths: parseFloat(selectedDuration.value),
        insurancePremium: 0.035,
        deliveryCost: 50,
        assemblyCost: 117,
        residualValue: parseFloat(selectedDuration.getAttribute('data-residualValue')),
        yearlyAdminFee1: 36,
        yearlyAdminFee2: 18.33,
        yearlyMaintenanceFee: parseFloat(document.querySelector('input[name="yearlyMaintenanceFee"]:checked').value) / VAT_RATE,
      },
    }
  }

  async fetchCalculation(data) {
    try {
      const response = await fetch(API_CONFIG.URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-offr-api-key': API_CONFIG.KEY,
        },
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      console.error('Calculation error:', error)
      throw new Error(`Failed to calculate: ${error.message}`)
    }
  }

  setValue(selector, value, withDollarSign = true, multiple = false) {
    const elements = multiple ? document.querySelectorAll(`[data-result="${selector}"]`) : [document.querySelector(`[data-result="${selector}"]`)]

    elements.forEach((element) => {
      if (element) {
        element.innerText = withDollarSign ? '€' + value : value
      }
    })
  }

  getDifference(a, b) {
    return Math.abs(a - b)
  }

  updateUI(result, data) {
    this.calculatorDefault.classList.add('hide')
    this.calculatorResult.style.display = 'block'

    window.scrollTo({
      top: this.resultWrapper.offsetTop,
      behavior: 'smooth',
    })

    term = document.querySelector('input[name="durationInMonths"]:checked').value
    const calculatePercentage = TERM_PERCENTAGES[term] || 0

    // Update all result values
    this.updateCalculationResults(result, data, calculatePercentage)
  }

  updateCalculationResults(r, data, calculatePercentage) {
    console.log(r)

    const beforeEmployerCostTotal = r.beforeLeaseSalary.employerCosts.holidayBonus + r.beforeLeaseSalary.employerCosts.sectoralPremium + r.beforeLeaseSalary.employerCosts.yearEndPremium
    const afterEmployerCostTotal = r.afterLeaseSalary.employerCosts.holidayBonus + r.afterLeaseSalary.employerCosts.sectoralPremium + r.afterLeaseSalary.employerCosts.yearEndPremium

    // Calculate monthly lease price and advantage based on financing method
    let monthlyLeasePriceNumber
    let advantagePerMonthNumber
    let recoupNumber

    // Update bonus-related elements visibility

    document.querySelectorAll('[data-bonus="hide"]').forEach((el) => el.classList.add('hide', data.financingMethod === 'BONUS'))
    document.querySelectorAll('[data-yearend="hide"]').forEach((el) => el.classList.add('hide', data.financingMethod === 'YEAR_END_PREMIUM'))

    switch (data.financingMethod) {
      case 'BONUS':
        monthlyLeasePriceNumber = r.leasePrice.monthlyLeasePrice * VAT_RATE * term
        advantagePerMonthNumber =
          this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityContributions, r.afterLeaseSalary.employerCosts.socialSecurityContributions) +
          this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction, r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction) +
          this.getDifference(r.beforeLeaseSalary.employerCosts.otherExpenses, r.afterLeaseSalary.employerCosts.otherExpenses)
        recoupNumber = r.diffs.grossBonus
        console.log(recoupNumber)
        document.querySelectorAll('[data-bonus="show"').forEach((el) => el.classList.remove('hide'))
        document.querySelectorAll('[data-yearend="hide"],[data-yearend="show"],[data-after]').forEach((el) => el.classList.add('hide'))
        document.querySelectorAll('.calculator_output-item').forEach((el) => el.classList.add('is-bonus'))
        document.querySelectorAll('[data-bonus-alt]').forEach((el) => el.classList.add('is--alternate'))
        document.querySelectorAll('[data-bonus-regular]').forEach((el) => el.classList.remove('is--alternate'))
        break
      case 'YEAR_END_PREMIUM':
        monthlyLeasePriceNumber = r.leasePrice.monthlyLeasePrice * VAT_RATE * 12
        advantagePerMonthNumber =
          this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityContributions, r.afterLeaseSalary.employerCosts.socialSecurityContributions) +
          this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction, r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction) +
          this.getDifference(r.beforeLeaseSalary.employerCosts.otherExpenses, r.afterLeaseSalary.employerCosts.otherExpenses)
        recoupNumber = r.diffs.grossYearEndPremium
        document.querySelectorAll('[data-yearend="show"]').forEach((el) => el.classList.remove('hide'))
        document.querySelectorAll('[data-bonus="hide"], [data-bonus="show"], [data-after]').forEach((el) => el.classList.add('hide'))

        document.querySelectorAll('.calculator_output-item').forEach((el) => el.classList.add('is-bonus'))
        document.querySelectorAll('[data-bonus-alt]').forEach((el) => el.classList.add('is--alternate'))
        document.querySelectorAll('[data-bonus-regular]').forEach((el) => el.classList.remove('is--alternate'))
        break
      default:
        monthlyLeasePriceNumber = r.leasePrice.monthlyLeasePrice * VAT_RATE
        advantagePerMonthNumber = monthlyLeasePriceNumber + r.diffs.grossSalary
        recoupNumber = r.diffs.grossSalary
        document.querySelectorAll('[data-yearend="show"], [data-bonus="show"]').forEach((el) => el.classList.add('hide'))
        document.querySelectorAll('[data-yearend="hide"], [data-bonus="hide"], [data-after]').forEach((el) => el.classList.remove('hide'))

        document.querySelectorAll('.calculator_output-item').forEach((el) => el.classList.remove('is-bonus'))
        document.querySelectorAll('[data-bonus-alt]').forEach((el) => el.classList.remove('is--alternate'))
        document.querySelectorAll('[data-bonus-regular]').forEach((el) => el.classList.add('is--alternate'))
    }

    // Update calculated values
    this.updateCalculatedValues(r, data, beforeEmployerCostTotal, afterEmployerCostTotal, monthlyLeasePriceNumber, advantagePerMonthNumber, calculatePercentage, recoupNumber)
  }

  updateCalculatedValues(r, data, beforeEmployerCostTotal, afterEmployerCostTotal, monthlyLeasePriceNumber, advantagePerMonthNumber, calculatePercentage, recoupNumber) {
    // Monthly lease price and maintenance
    document.querySelectorAll('[data-result="monthlyLeasePrice"]').forEach((el) => (el.innerText = monthlyLeasePriceNumber.toFixed(1)))

    this.setValue('maintenanceCost', (r.leasePrice.maintenanceCost * 12 * VAT_RATE).toFixed(1))

    // Service package and duration
    this.setValue('servicePackage', document.querySelector('input[name="yearlyMaintenanceFee"]:checked').getAttribute('data-label'), false)
    this.setValue('durationInMonths', document.querySelector('input[name="durationInMonths"]:checked').getAttribute('data-label').split(' ')[0], false, true)

    // Social security contributions
    this.setValue('beforeSocialSecurityContribution', r.beforeLeaseSalary.employerCosts.socialSecurityContributions.toFixed(1))
    this.setValue('afterSocialSecurityContribution', r.afterLeaseSalary.employerCosts.socialSecurityContributions.toFixed(1))
    this.setValue('beforeSocialSecurityStructuralReduction', this.formatNegativeAmount(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction), false)
    this.setValue('afterSocialSecurityStructuralReduction', this.formatNegativeAmount(r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction), false)

    // Other expenses
    this.setValue('beforeOtherExpenses', r.beforeLeaseSalary.employerCosts.otherExpenses.toFixed(1))
    this.setValue('afterOtherExpenses', r.afterLeaseSalary.employerCosts.otherExpenses.toFixed(1))

    // Werkgever kost

    // Advantages and totals
    this.setValue('advantage', advantagePerMonthNumber.toFixed(1), false, true)
    this.setValue('recoup', Math.abs(recoupNumber).toFixed(1), false, true)
    this.setValue('beforeEmployerTotal', this.formatNegativeAmount(beforeEmployerCostTotal), false)
    this.setValue('afterEmployerTotal', this.formatNegativeAmount(afterEmployerCostTotal), false)
    const savedTotalYearlyNumber =
      this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityContributions, r.afterLeaseSalary.employerCosts.socialSecurityContributions) +
      this.getDifference(r.beforeLeaseSalary.employerCosts.socialSecurityStructuralReduction, r.afterLeaseSalary.employerCosts.socialSecurityStructuralReduction) +
      this.getDifference(r.beforeLeaseSalary.employerCosts.otherExpenses, r.afterLeaseSalary.employerCosts.otherExpenses) +
      this.getDifference(beforeEmployerCostTotal, afterEmployerCostTotal)
    this.setValue('savedTotalYearly', savedTotalYearlyNumber.toFixed(1))

    // Salary calculations
    this.setValue('beforeLeaseSalaryGross', r.beforeLeaseSalary.grossSalary.toFixed(1))
    this.setValue('afterLeaseSalaryGross', r.afterLeaseSalary.grossSalary.toFixed(1))
    this.setValue('beforeSocialSecurityContributions', this.formatNegativeAmount(r.beforeLeaseSalary.socialSecurityContributions), false)
    this.setValue('beforeSpecialSocialSecurityContributions', this.formatNegativeAmount(r.beforeLeaseSalary.specialSocialSecurityContributions), false)
    this.setValue('afterSocialSecurityContributions', this.formatNegativeAmount(r.afterLeaseSalary.socialSecurityContributions), false)
    this.setValue('afterSpecialSocialSecurityContributions', this.formatNegativeAmount(r.afterLeaseSalary.specialSocialSecurityContributions), false)
    this.setValue('beforeNetSalary', r.beforeLeaseSalary.monthlyNetSalary.toFixed(1))
    this.setValue('afterNetSalary', r.afterLeaseSalary.monthlyNetSalary.toFixed(1))

    // Work bonus and income
    this.setValue('beforeWorkBonus', r.beforeLeaseSalary.workBonus.toFixed(1))
    this.setValue('afterWorkBonus', r.afterLeaseSalary.workBonus.toFixed(1))
    this.setValue('beforeTaxableIncome', r.beforeLeaseSalary.taxableIncome.toFixed(1))
    this.setValue('afterTaxableIncome', r.afterLeaseSalary.taxableIncome.toFixed(1))
    this.setValue('beforeIncomeTax', this.formatNegativeAmount(r.beforeLeaseSalary.incomeTaxes), false)
    this.setValue('afterIncomeTax', this.formatNegativeAmount(r.afterLeaseSalary.incomeTaxes), false)

    // Net calculations
    this.setValue('monthlyNet', Math.abs(r.diffs.monthlyNet.toFixed(1)))
    this.setValue('totalNet', Math.abs(r.diffs.totalNet.toFixed(1)))
    this.setValue('residualValue', (data.computeLeaseRateDto.bikeRetailPrice * calculatePercentage * VAT_RATE).toFixed(1))

    // Bike allowance calculations
    const fietsVergoeding = document.querySelector('#fietsVergoeding').value || 0.27
    const bikeAllowance = Math.min((4 * (data.commuteKilometers * 2) * data.commuteWeeklyFrequency * fietsVergoeding).toFixed(1), 625)
    this.setValue('potentialMonthlyBikeAllowance', bikeAllowance)

    // Package value calculations
    const totalLeasePrice = r.leasePrice.totalLeasePrice * VAT_RATE
    const savedValue = Math.abs(totalLeasePrice) - Math.abs(r.diffs.totalNet) - Math.abs(data.computeLeaseRateDto.bikeRetailPrice * data.computeLeaseRateDto.residualValue)

    this.setValue('packageValue', Math.abs(totalLeasePrice.toFixed(1)))
    this.setValue('packageValueCalc', savedValue.toFixed(1))
  }

  formatNegativeAmount(amount) {
    return amount === 0 ? '€0' : `- €${Math.abs(amount.toFixed(1))}`
  }

  async handleSubmit(e) {
    e.preventDefault()
    try {
      this.setLoadingState(true)
      const data = this.getFormData()
      const result = await this.fetchCalculation(data)
      this.updateUI(result, data)
    } catch (error) {
      console.error('Submission error:', error)
      window.alert(`Error: ${error.message}`)
    } finally {
      this.setLoadingState(false)
    }
  }
}

// Initialize the calculator when the DOM is ready
new CalculatorApp()
