/*! print-helper.js */
(function () {
  const DEFAULTS = {
    // Set to a container (e.g., "#MainContent") to print just that area.
    printRoot: null,

    // Elements to hide when printing:
    hideSelectors: [
      "header", "footer", ".navbar", ".sub-nav-wrapper",
      ".col-secondary", "#SideBarPanel", "#printFormBtn",
      ".no-print"
    ],

    // Auto add a floating button:
    button: true,
    buttonText: "Print",
    buttonStyle: `
      position:fixed; top:12px; right:12px; z-index:9999;
      padding:8px 14px; border:0; border-radius:6px;
      background:#2b6cb0; color:#fff; font:14px/1.2 sans-serif;
      cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.2);
    `
  };

  function buildPrintCSS(opts) {
    const hide = (opts.hideSelectors || []).join(", ");

    // If a printRoot is supplied, only show that subtree during print.
    const limitToRoot = opts.printRoot ? `
      body * { visibility: hidden !important; }
      ${opts.printRoot}, ${opts.printRoot} * { visibility: visible !important; }
      ${opts.printRoot} { position: relative !important; left: 0 !important; top: 0 !important; }
    ` : "";

    return `
@media print {
  html, body { height:auto !important; overflow:visible !important; background:#fff !important; }
  ${hide} { display:none !important; }

  /* Expand scrollable areas so full content prints */
  .scrollbar-minimal, .scrollable, .panel, .panel-body,
  .RadGrid .rgDataDiv, .rgDataDiv, .rgDetailDiv {
    overflow: visible !important; height: auto !important; max-height: none !important;
  }
  /* Catch inline height/overflow styles */
  div[style*="overflow:auto"], div[style*="overflow:scroll"],
  div[style*="max-height"], div[style*="height:"] {
    overflow: visible !important; height: auto !important; max-height: none !important;
  }

  /* Grids often force table-layout; relax for printing */
  .RadGrid .rgMasterTable { table-layout: auto !important; width: 100% !important; }

  /* Make main containers fluid */
  .container, .row, .col-primary, #MainContent, #ContentPanel, #ctl01_MainBody, #ctl01_MainBodyWrapper {
    width:100% !important; max-width:100% !important; float:none !important;
  }

  /* Page margins */
  @page { margin: 12mm; }

  ${limitToRoot}
}
    `;
  }

  function injectStyle(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function addButton(opts) {
    if (!opts.button) return null;
    if (document.getElementById("printFormBtn")) return document.getElementById("printFormBtn");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "printFormBtn";
    btn.textContent = opts.buttonText || DEFAULTS.buttonText;
    btn.setAttribute("style", opts.buttonStyle || DEFAULTS.buttonStyle);
    btn.addEventListener("click", () => window.print());
    document.body.appendChild(btn);
    return btn;
  }

  const API = {
    init(userOptions) {
      const opts = Object.assign({}, DEFAULTS, userOptions || {});
      injectStyle("print-helper-style", buildPrintCSS(opts));
      addButton(opts);
      return API;
    },
    printNow() {
      window.print();
    }
  };

  // Expose globally
  window.PrintHelper = API;
})();
