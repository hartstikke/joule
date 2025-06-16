document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slider_2_wrap').forEach((wrap) => {
    if (wrap.dataset.scriptInitialized) return
    wrap.dataset.scriptInitialized = 'true'

    const cmsWrap = wrap.querySelector('.slider_2_cms_wrap')

    if (!cmsWrap) {
      console.warn('Missing required elements for Swiper in:', wrap)
      return
    }

    const swiper = new Swiper(cmsWrap, {
      slidesPerView: 'auto',
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      centeredSlides: false,
      autoHeight: false,
      speed: 600,
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: wrap.querySelector('.slider_2_btn_element.is-next'),
        prevEl: wrap.querySelector('.slider_2_btn_element.is-prev'),
      },
      pagination: {
        el: wrap.querySelector('.slider_2_bullet_wrap'),
        bulletActiveClass: 'is-active',
        bulletClass: 'slider_2_bullet_item',
        bulletElement: 'button',
        clickable: true,
      },
      scrollbar: {
        el: wrap.querySelector('.slider_2_draggable_wrap'),
        draggable: true,
        dragClass: 'slider_2_draggable_handle',
        snapOnRelease: true,
      },
      slideActiveClass: 'is-active',
      slideDuplicateActiveClass: 'is-active',
    })
  })
})
