// on Weglot init
Weglot.on('initialized', () => {
    const currentLang = Weglot.getCurrentLang()
    setTimeout(() => {
        updateHubspot(currentLang)
    }, 1000)
    updateSW5DropdownLinks(currentLang)
    if (document.querySelector('.wg-element-wrapper.sw1 [lang=' + currentLang + ']')) {
        document.querySelector('.wg-element-wrapper.sw1 [lang=' + currentLang + ']').click()
    }
})

// for each of the .wg-element-wrapper language links
document.querySelectorAll('.wg-element-wrapper.sw5 [lang]').forEach((link) => {
    // add a click event listener
    link.addEventListener('click', function (e) {
        e.preventDefault()
        Weglot.switchTo(this.getAttribute('lang'))
        updateSW5DropdownLinks(this.getAttribute('lang'))
    })
})

function updateHubspot(lang) {
    if (document.getElementById('form-brochure')) {
        let embedDestinations = [...document.querySelectorAll('#form-brochure')]

        embedDestinations.forEach((destination) => {
            while (destination.firstChild) {
                destination.removeChild(destination.firstChild)
            }

            var hubspotEmbed = document.createElement('script')
            if (lang === 'nl') {
                hubspotEmbed.textContent = nederlandsDownload
            } else if (lang === 'en') {
                hubspotEmbed.textContent = engelsDownload
            } else if (lang === 'fr') {
                hubspotEmbed.textContent = fransDownload
            } else {
                console.log('fout')
            }
            destination.appendChild(hubspotEmbed)
        })
    }
}

// updateDropdownLinks function
function updateSW5DropdownLinks(currentLang) {
    // get the wrapper element
    const $wrapper = document.querySelector('.wg-element-wrapper.sw5')
    // if the .w-dropdown-toggle is not the current active language
    if ($wrapper.querySelector('.w-dropdown-toggle').getAttribute('lang') !== currentLang) {
        // get the current active language link
        const $activeLangLink = $wrapper.querySelector('[lang=' + currentLang + ']')
        // swap the dropdown toggle's text with the current active language link text
        const $toggle = $activeLangLink.closest('.wg-element-wrapper').querySelector('.w-dropdown-toggle')
        const toggleTxt = $toggle.textContent
        const activeLangLinkTxt = $activeLangLink.textContent
        $toggle.querySelector('div').textContent = activeLangLinkTxt
        $activeLangLink.textContent = toggleTxt
        // swap the dropdown toggle's lang attr with the current active language link lang attr
        const lang = $activeLangLink.getAttribute('lang')
        const toggleLang = $toggle.getAttribute('lang')
        $toggle.setAttribute('lang', lang)
        $activeLangLink.setAttribute('lang', toggleLang)
    }
}

Weglot.on('languageChanged', function (newLang) {
    updateHubspot(newLang)
    updateFAQ(newLang)
})
