import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

export const js = () => {
  gsap.registerPlugin(Flip, TextPlugin);

  // ELEMENTS //
  const linksContainer = document.querySelector('.main_left-column');
  const logos = document.querySelectorAll('.main_logo');
  const logoLoader = document.querySelector('.main_logo-loader');
  const logoText = document.querySelector('.main_logo-top-text');
  const logoWrapper = document.querySelector('.main_logo-wrapper');
  const serviceLoader = document.querySelector('.service_logo-loader');
  const serviceLogo = document.querySelector('.service_logo');
  const infoBtnEmail = document.querySelector('#infobar-email');
  const infoBtnPhone = document.querySelector('#infobar-phone');
  const supportingText = document.querySelector('.main_logo-top-text');

  function pageLoad() {
    const state = Flip.getState(serviceLogo);

    serviceLoader?.classList.remove('is-loading');
    serviceLogo?.classList.remove('is-loading');

    Flip.from(state, {
      duration: 0.2,
      ease: 'power1.inOut',
      absolute: true,
    });
  }

  function startLoader() {
    const state = Flip.getState(logoLoader);

    logoLoader?.classList.add('is-loading');
    logoText?.classList.add('is-inactive');
    logoWrapper?.classList.add('is-loading');

    Flip.from(state, {
      duration: 0.2,
      ease: 'power1.inOut',
    });
  }

  window.onload = () => {
    pageLoad();
  };

  linksContainer?.addEventListener('click', (e) => {
    const target = e.target.closest('.main_link');
    const link = target.getAttribute('href');
    if (!target) return;

    e.preventDefault();

    startLoader();

    setTimeout(() => {
      window.location.replace(link);
      history.pushState(null, null, window.location.href);
    }, 200);
  });

  const popups = document.querySelectorAll('[popup]');
  popups.forEach((popup) => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        gsap.fromTo(
          popup,
          {
            translateY: '0%',
            opacity: 1,
            duration: 0.1,
          },
          {
            translateY: '-100%',
            opacity: 0,
            duration: 0.1,
          }
        );
        popup.style.display = 'none';
      }
    });
  });

  linksContainer?.addEventListener('mouseover', (e) => {
    const hoveredEl = e.target.closest('.main_link');
    if (!hoveredEl) return;
    const link = e.target.closest('.main_link');
    const h1 = link.querySelector('.display-1');
    const data = {
      email: link.getAttribute('data-email'),
      phone: String(link.getAttribute('data-phone')),
      backgroundColor: link.getAttribute('data-color'),
      textColor: link.getAttribute('data-contact-text-color'),
      borderColor: link.getAttribute('data-contact-text-color'),
    };

    const activate = gsap.to(h1, {
      color: data.backgroundColor,
      duration: 0.1,
    });

    gsap.to(infoBtnEmail, {
      text: data.email,
      ease: 'ease',
      duration: 0.1,
    });

    gsap.to(infoBtnPhone, {
      text: data.phone,
      ease: 'ease',
      duration: 0.1,
    });
    activate.play();

    // Swap logo
    const logo = [...logos].find(
      (logo) => logo.getAttribute('data-service') === hoveredEl.getAttribute('data-service')
    );
    logos.forEach((logo) => logo.classList.remove('is-active'));
    logo?.classList.add('is-active');

    gsap.fromTo(
      logo,
      {
        opacity: 0,
        // filter: 'blur(5px)',
      },
      {
        opacity: 1,
        // filter: 'blur(0px)',
        ease: 'power1',
        duration: 0.5,
      }
    );
  });

  linksContainer?.addEventListener('mouseout', (e) => {
    const hoveredEl = e.target.closest('.main_link');
    if (!hoveredEl || logoLoader?.classList.contains('is-loading')) return;
    linksContainer.childNodes.forEach((link) => {
      const deactivate = gsap.to(link.firstChild, {
        color: 'black',
        duration: 0.1,
      });

      gsap.to(infoBtnEmail, {
        text: 'BUD@INTEBARAPOST.SE',
        ease: 'ease',
        duration: 0.1,
      });

      gsap.to(infoBtnPhone, {
        text: '08-505 255 00',
        ease: 'ease',
        duration: 0.1,
      });

      deactivate.play();

      logos.forEach((logo) => logo.classList.remove('is-active'));

      [...logos]
        .find((logo) => logo.getAttribute('data-service') === 'general')
        ?.classList.add('is-active');
    });
  });

  const textAnim = gsap.fromTo(
    supportingText,
    {
      rotate: -2,
    },
    {
      rotate: 2,
      yoyoEase: 'power1',
      repeat: -1,
      duration: 2,
      ease: 'ease',
    }
  );
};
