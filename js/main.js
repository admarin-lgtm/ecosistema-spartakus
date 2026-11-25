// Carga el script que está en la raíz del sitio; index.html referencia ./js/main.js.
(() => {
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const appScript = document.createElement("script");
  appScript.src = new URL("../main.js", currentScript.src).href;
  appScript.defer = true;
  document.head.append(appScript);
})();
