var profit = document.getElementById('profit')
var fiscaalResult = document.getElementById('fiscaal-resultaat')
var financieelResult = document.getElementById('financieel-resultaat')
var fiscaalVoordeel = document.getElementById('fiscaal-voordeel')
var financieelVoordeel = document.getElementById('financieel-voordeel')
var investeringsBedrag = document.getElementById('investerings-bedrag')
var investeringResult = document.getElementById('optimale-investering')
var nettoRendement = document.getElementById('netto-rendement')
var totaal = document.getElementById('totaal')
var formatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

var optimaleInvestering
var fiscaal
var financieel
var som

const fiscaalRendement = 5.25
const financieelRendementInterestNetto = 9.18

profit.oninput = function () {
  optimaleInvestering = Math.min(((parseFloat(profit.value) * 10) / 100).toFixed(2), 237529)

  fiscaal = Math.min(((parseFloat(optimaleInvestering) * fiscaalRendement) / 100).toFixed(2), 12470)
  financieel = Math.min(((parseFloat(optimaleInvestering) * financieelRendementInterestNetto) / 100).toFixed(2), 21805)
  som = (parseFloat(fiscaal) + parseFloat(financieel)).toFixed(2)

  fiscaalResult.value = formatter.format(fiscaal)
  fiscaalVoordeel.innerText = formatter.format(fiscaal)
  financieelResult.value = formatter.format(financieel)
  financieelVoordeel.innerText = formatter.format(financieel)
  investeringsBedrag.value = formatter.format(optimaleInvestering)
  investeringResult.innerText = formatter.format(optimaleInvestering)
  nettoRendement.value = formatter.format(som)
  totaal.innerText = formatter.format(som)
}

if (optimaleInvestering == 237529) {
  document.querySelector('.result_maximum').classList.remove('hide')
} else {
  document.querySelector('.result_maximum').classList.add('hide')
}
