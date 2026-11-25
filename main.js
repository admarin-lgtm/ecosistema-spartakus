(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const videoDialog = document.querySelector("#video-dialog");
  const dialogVideo = document.querySelector("[data-dialog-video]");
  const videoOpenButton = document.querySelector("[data-video-open]");
  const videoCloseButton = document.querySelector("[data-video-close]");
  const videoUrl = "https://www.youtube.com/embed/UItWltVZZmE?autoplay=1&rel=0";

  if (videoDialog instanceof HTMLDialogElement && dialogVideo && videoOpenButton && videoCloseButton) {
    const closeVideo = () => {
      videoDialog.close();
      dialogVideo.replaceChildren();
      videoOpenButton.focus();
    };

    videoOpenButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = videoUrl;
      iframe.title = "Entrenamiento de cuerpo completo para principiantes (video de referencia)";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "origin";
      dialogVideo.replaceChildren(iframe);
      videoDialog.showModal();
      videoCloseButton.focus();
    });

    videoCloseButton.addEventListener("click", closeVideo);
    videoDialog.addEventListener("click", (event) => {
      if (event.target === videoDialog) closeVideo();
    });
    videoDialog.addEventListener("close", () => dialogVideo.replaceChildren());
  }

  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const fields = {
    name: document.querySelector("#full-name"),
    phone: document.querySelector("#phone"),
    service: document.querySelector("#service"),
    message: document.querySelector("#message")
  };
  const errors = {
    name: document.querySelector("#name-error"),
    phone: document.querySelector("#phone-error"),
    service: document.querySelector("#service-error"),
    message: document.querySelector("#message-error")
  };

  if (form instanceof HTMLFormElement && status && Object.values(fields).every(Boolean)) {
    const validate = () => {
      const values = {
        name: fields.name.value.trim(),
        phone: fields.phone.value.trim(),
        service: fields.service.value,
        message: fields.message.value.trim()
      };
      const phoneDigits = values.phone.replace(/\D/g, "");
      const messages = {
        name: values.name.length < 2 ? "Escribe tu nombre completo." : "",
        phone: phoneDigits.length < 7 ? "Ingresa un teléfono válido." : "",
        service: values.service ? "" : "Selecciona un servicio de interés.",
        message: values.message.length < 8 ? "Cuéntanos un poco más (mínimo 8 caracteres)." : ""
      };

      Object.keys(messages).forEach((key) => {
        const field = fields[key];
        errors[key].textContent = messages[key];
        field.setAttribute("aria-invalid", String(Boolean(messages[key])));
        if (messages[key]) field.setAttribute("aria-describedby", errors[key].id);
        else field.removeAttribute("aria-describedby");
      });

      return { values, messages, isValid: Object.values(messages).every((message) => !message) };
    };

    Object.values(fields).forEach((field) => {
      field.addEventListener("input", () => {
        status.textContent = "";
        validate();
      });
      field.addEventListener("change", () => {
        status.textContent = "";
        validate();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = validate();
      if (!result.isValid) {
        status.textContent = "Revisa los campos marcados antes de continuar.";
        const firstInvalid = Object.values(fields).find((field) => field.getAttribute("aria-invalid") === "true");
        firstInvalid?.focus();
        return;
      }

      const text = [
        "Hola Apartakus, quiero más información.",
        `Nombre: ${result.values.name}`,
        `Teléfono: ${result.values.phone}`,
        `Servicio: ${result.values.service}`,
        `Mensaje: ${result.values.message}`
      ].join("\n");
      const whatsappUrl = `https://wa.me/573186298033?text=${encodeURIComponent(text)}`;
      const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (!whatsappWindow) {
        status.textContent = "Tu navegador bloqueó la nueva ventana. Permite ventanas emergentes o usa el botón flotante de WhatsApp.";
        return;
      }

      status.textContent = "WhatsApp se abrió con tu mensaje listo para enviar.";
      form.reset();
      Object.values(fields).forEach((field) => {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      });
      Object.values(errors).forEach((error) => { error.textContent = ""; });
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
