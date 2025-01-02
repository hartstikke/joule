// on Weglot init
Weglot.on('initialized', () => {
    // get the current active language
    const currentLang = Weglot.getCurrentLang()
    // call updateDropdownLinks function
    setTimeout(() => {
        updateHubspot(currentLang)
    }, 1000)
    updateFAQ(currentLang)
    updateSW5DropdownLinks(currentLang)
    if (document.querySelector('.wg-element-wrapper.sw1 [lang=' + currentLang + ']')) {
        // click the link
        document.querySelector('.wg-element-wrapper.sw1 [lang=' + currentLang + ']').click()
    }
})

// for each of the .wg-element-wrapper language links
document.querySelectorAll('.wg-element-wrapper.sw5 [lang]').forEach((link) => {
    // add a click event listener
    link.addEventListener('click', function (e) {
        // prevent default
        e.preventDefault()
        // switch to the current active language
        Weglot.switchTo(this.getAttribute('lang'))
        // call updateDropdownLinks function
        updateSW5DropdownLinks(this.getAttribute('lang'))
    })
})

function faqKlantenzone(lang) {
    if (document.querySelector('[id*="faq-klantenzone"]')) {
        const faqKlantenzones = document.querySelectorAll('[id*="faq-klantenzone"]')

        faqKlantenzones.forEach((faqKlantenzone) => {
            while (faqKlantenzone.firstChild) {
                faqKlantenzone.removeChild(faqKlantenzone.firstChild)
            }
            var a = document.createElement('a')
            if (lang === 'nl') {
                a.href = 'https://shop.joule.be'
                a.textContent = 'Klantenzone'
            } else if (lang === 'en') {
                a.href = 'https://shop.joule.be'
                a.textContent = 'Client space'
            } else if (lang === 'fr') {
                a.href = 'https://shop.joule.be/fr'
                a.textContent = 'Espace clientèle'
            } else {
                console.log('no faq-klantenzone found')
            }
            faqKlantenzone.appendChild(a)
        })
    }
}

function faqLucien(lang) {
    if (document.getElementById('faq-lucien')) {
        var faqLucienWrapper = document.getElementById('faq-lucien')
        while (faqLucienWrapper.firstChild) {
            faqLucienWrapper.removeChild(faqLucienWrapper.firstChild)
        }
        var a = document.createElement('a')
        if (lang === 'nl') {
            a.href = 'https://lucien.bike/nl/fietsenwinkels/'
            a.textContent = 'Onze fietsenwinkels | Lucien'
        } else if (lang === 'en') {
            a.href = 'https://lucien.bike/en/bike-shops/'
            a.textContent = 'Bike Shop | Lucien'
        } else if (lang === 'fr') {
            a.href = 'https://lucien.bike/fr/magasins-de-velos/'
            a.textContent = 'Nos magasins de vélos | Lucien'
        } else {
            console.log('fout')
        }
        faqLucienWrapper.appendChild(a)
    }
}

function fietsgidsButtonHome(lang) {
    if (document.getElementById('fietsgids-button-home')) {
        var fietsgidsButtonWrapper = document.getElementById('fietsgids-button-home')
        if (lang === 'nl') {
            fietsgidsButtonWrapper.href = 'https://blog.joule.be/financiele-gids-fietsleasing'
            return
        } else if (lang === 'en') {
            fietsgidsButtonWrapper.href = 'https://blog.joule.be/en/financial-guide-bike-leasing'
            return
        } else if (lang === 'fr') {
            fietsgidsButtonWrapper.href = 'https://blog.joule.be/fr/guide-financier-leasing-velo'
            return
        } else {
            console.log('fout')
        }
    }
}

function faqBlog1(lang) {
    if (document.getElementById('faq-blog1')) {
        var faqBlog1Wrapper = document.getElementById('faq-blog1')
        while (faqBlog1Wrapper.firstChild) {
            faqBlog1Wrapper.removeChild(faqBlog1Wrapper.firstChild)
        }
        var a = document.createElement('a')
        if (lang === 'nl') {
            a.href = 'https://blog.joule.be/batterij-onderhouden-elektrische-fiets'
            a.textContent = '7 tips om de batterij van je elektrische fiets te onderhouden'
        } else if (lang === 'en') {
            a.href = 'https://blog.joule.be/en/maintaining-electric-bike-battery-tips'
            a.textContent = '7 tips for maintaining your electric bike battery'
        } else if (lang === 'fr') {
            a.href = 'https://blog.joule.be/fr/entretenir-batterie-velo-electrique'
            a.textContent = '7 conseils pour entretenir la batterie de votre vélo électrique'
        } else {
            console.log('fout')
        }
        faqBlog1Wrapper.appendChild(a)
    }
}

function faqBlog2(lang) {
    if (document.getElementById('faq-blog2')) {
        var faqBlog2Wrapper = document.getElementById('faq-blog3')
        while (faqBlog2Wrapper.firstChild) {
            faqBlog2Wrapper.removeChild(faqBlog2Wrapper.firstChild)
        }
        var a = document.createElement('a')
        if (lang === 'nl') {
            a.href = 'https://blog.joule.be/hoe-starten-met-een-fietsplan-op-het-werk'
            a.textContent = 'Hoe starten met een fietsplan op het werk?'
        } else if (lang === 'en') {
            a.href = 'https://blog.joule.be/en/starting-bike-plan-work'
            a.textContent = 'How to start a bike plan at work?'
        } else if (lang === 'fr') {
            a.href = 'https://blog.joule.be/fr/comment-demarrer-plan-matiere-velos-travail'
            a.textContent = 'Comment démarrer un plan en matière de vélos au travail ?'
        } else {
            console.log('fout')
        }
        faqBlog2Wrapper.appendChild(a)
    }
}

function faqBlog3(lang) {
    if (document.getElementById('faq-blog3')) {
        var faqBlog3Wrapper = document.getElementById('faq-blog3')
        while (faqBlog3Wrapper.firstChild) {
            faqBlog3Wrapper.removeChild(faqBlog3Wrapper.firstChild)
        }
        var a = document.createElement('a')
        if (lang === 'nl') {
            a.href = 'https://blog.joule.be/fietspolicy-fietsleasing-tips'
            a.textContent = 'Fietspolicy opstellen bij fietsleasing: 7 praktische tips'
        } else if (lang === 'en') {
            a.href = 'https://blog.joule.be/en/bike-policy-leasing-tips'
            a.textContent = "Établir une politique en matière de vélos lors d'un leasing pour un vélo : 7 conseils pratiques"
        } else if (lang === 'fr') {
            a.href = 'https://blog.joule.be/fr/etablir-politique-leasing-v%C3%A9los-conseils-pratiques'
            a.textContent = 'Setting up a bike policy for bike leasing: 7 practical tips'
        } else {
            console.log('fout')
        }
        faqBlog3Wrapper.appendChild(a)
    }
}

function updateFAQ(lang) {
    faqKlantenzone(lang)
    faqLucien(lang)
    faqBlog1(lang)
    faqBlog2(lang)
    faqBlog3(lang)
    fietsgidsButtonHome(lang)
}

function updateHubspot(lang) {
    if (document.getElementById('whitepaper-werkgever-embed')) {
        var werkgeverWrapper = document.getElementById('whitepaper-werkgever-embed')
        while (werkgeverWrapper.firstChild) {
            werkgeverWrapper.removeChild(werkgeverWrapper.firstChild)
        }

        var hubspotEmbed = document.createElement('script')
        if (lang === 'nl') {
            hubspotEmbed.textContent = nederlandsWerkgever
        } else if (lang === 'en') {
            hubspotEmbed.textContent = engelsWerkgever
        } else if (lang === 'fr') {
            hubspotEmbed.textContent = fransWerkgever
        } else {
            console.log('fout')
        }
        werkgeverWrapper.appendChild(hubspotEmbed)
    }

    if (document.getElementById('whitepaper-overheid-embed')) {
        var overheidWrapper = document.getElementById('whitepaper-overheid-embed')
        while (overheidWrapper.firstChild) {
            overheidWrapper.removeChild(overheidWrapper.firstChild)
        }

        var hubspotEmbed = document.createElement('script')
        if (lang === 'nl') {
            hubspotEmbed.textContent = nederlandsOverheid
        } else if (lang === 'en') {
            hubspotEmbed.textContent = engelsOverheid
        } else if (lang === 'fr') {
            hubspotEmbed.textContent = fransOverheid
        } else {
            console.log('fout')
        }
        overheidWrapper.appendChild(hubspotEmbed)
    }

    if (document.getElementById('contact-embed')) {
        var contactWrapper = document.getElementById('contact-embed')
        console.log(contactWrapper)
        while (contactWrapper.firstChild) {
            contactWrapper.removeChild(contactWrapper.firstChild)
            console.log('child removed')
        }

        var hubspotEmbed = document.createElement('script')
        if (lang === 'nl') {
            hubspotEmbed.textContent = nederlandsContact
        } else if (lang === 'en') {
            hubspotEmbed.textContent = engelsContact
        } else if (lang === 'fr') {
            hubspotEmbed.textContent = fransContact
        } else {
            console.log('fout')
        }
        contactWrapper.appendChild(hubspotEmbed)
    }

    if (document.getElementById('promotion-embed')) {
        var contactWrapper = document.getElementById('promotion-embed')
        console.log(contactWrapper)
        while (contactWrapper.firstChild) {
            contactWrapper.removeChild(contactWrapper.firstChild)
            console.log('child removed')
        }

        var hubspotEmbed = document.createElement('script')
        if (lang === 'nl') {
            hubspotEmbed.textContent = nederlandsPromotion
        } else if (lang === 'en') {
            hubspotEmbed.textContent = engelsPromotion
        } else if (lang === 'fr') {
            hubspotEmbed.textContent = franssPromotion
        } else {
            console.log('fout')
        }
        contactWrapper.appendChild(hubspotEmbed)
    }

    // Downloads Meeting Embed
    if (document.getElementById('meeting-embed-wrapper')) {
        var meetingWrapper = document.getElementById('meeting-embed-wrapper')

        // Clear previous content
        while (meetingWrapper.firstChild) {
            meetingWrapper.removeChild(meetingWrapper.firstChild)
        }

        var hubspotEmbed = document.createElement('div')
        hubspotEmbed.classList.add('meetings-iframe-container')

        // Set the meeting link based on language
        if (lang === 'nl') {
            hubspotEmbed.dataset.src = nederlandsMeeting
        } else if (lang === 'fr') {
            hubspotEmbed.dataset.src = fransMeeting
        } else if (lang === 'en') {
            hubspotEmbed.dataset.src = engelsMeeting
        } else {
            console.error('Language not supported')
        }

        meetingWrapper.appendChild(hubspotEmbed)

        // Dynamically add the HubSpot Meetings Embed Script
        var hsScript = document.createElement('script')
        hsScript.type = 'text/javascript'
        hsScript.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
        document.body.appendChild(hsScript)
    }

    if (document.getElementById('newsletter-embed')) {
        let newsletterWrappers = document.querySelectorAll('#newsletter-embed')

        newsletterWrappers.forEach((newsletterWrapper) => {
            while (newsletterWrapper.firstChild) {
                newsletterWrapper.removeChild(newsletterWrapper.firstChild)
            }

            var hubspotEmbed = document.createElement('script')
            if (lang === 'nl') {
                hubspotEmbed.textContent = nederlandsNewsletter
            } else if (lang === 'en') {
                hubspotEmbed.textContent = engelsNewsletter
            } else if (lang === 'fr') {
                hubspotEmbed.textContent = fransNewsletter
            } else {
                console.log('fout')
            }
            newsletterWrapper.appendChild(hubspotEmbed)
        })
    }

    if (document.getElementById('download-embed')) {
        let newsletterWrappers = [...document.querySelectorAll('#download-embed')]

        newsletterWrappers.forEach((newsletterWrapper) => {
            while (newsletterWrapper.firstChild) {
                newsletterWrapper.removeChild(newsletterWrapper.firstChild)
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
            newsletterWrapper.appendChild(hubspotEmbed)
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

// for each of the .wg-element-wrapper language links
document.querySelectorAll('.wg-element-wrapper.sw1 [lang]').forEach((link) => {
    // add a click event listener
    link.addEventListener('click', function (e) {
        // prevent default
        e.preventDefault()
        // switch current active language after a setTimeout
        setTimeout(() => Weglot.switchTo(this.getAttribute('lang')), 160)
    })
})

Weglot.on('languageChanged', function (newLang) {
    updateHubspot(newLang)
    updateFAQ(newLang)
})
