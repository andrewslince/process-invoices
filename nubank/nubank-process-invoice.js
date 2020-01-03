/****************************************************************************/
/*                                  UTILS                                   */
/****************************************************************************/

function getElmInnerText(elm, selector) {
  var newElm = elm.querySelector(selector);

  return (newElm)
    ? newElm.innerText
    : undefined;
}

function getRawAmount(amount, currencySymbol) {
  return amount
    .replace(currencySymbol, "")
    .replace(".", "")
    .replace(",", ".");
}


/****************************************************************************/
/*                              INVOICE PROCESS                             */
/****************************************************************************/

function getInvoices(type) {
  var invoicesSelector = (type === "all")

    // all invoices
    ? ".md-tab-content"

    // current invoice
    : "#" + document.querySelector(".md-tab-themed.active")
      .getAttribute("aria-controls");

  return Array.from(document.querySelectorAll(invoicesSelector));
}

function getInvoiceInfo(invoiceElm) {
  return {
    summary: getInvoiceSummary(invoiceElm),
    charges: getInvoiceCharges(invoiceElm, options)
  };
}

function getInvoiceSummary(invoiceElm) {
  var invoiceSummary = {};
  var selector = ".summary";
  var summaryElm = invoiceElm.querySelector(selector);

  // summary amount
  invoiceSummary.amount = getElmInnerText(summaryElm, ".amount");

  // summary due date
  invoiceSummary.dueDate = getElmInnerText(summaryElm, ".due .date");

  // summary closure
  var closure = getElmInnerText(summaryElm, ".detail .date") || undefined;
  if (closure) {
    invoiceSummary.closure = closure;
  }

  return invoiceSummary;
}

function getChargeAmountInfo(chargeElm, currencySymbol) {
  var chargeAmount = getElmInnerText(chargeElm, ".charge-data .amount");

  return {
    formatted: currencySymbol + " " + chargeAmount,
    raw: getRawAmount(chargeAmount)
  };
}

function getInvoiceCharges(invoiceElm, options) {
  var invoiceCharges = [];
  var selector = ".charge";

  invoiceElm.querySelectorAll(selector).forEach(function(chargeElm) {
    // get invoice info
    invoiceCharges.push({
      description: getElmInnerText(chargeElm, ".charge-data .description"),
      amount: getChargeAmountInfo(chargeElm, options.currencySymbol),
      date: getElmInnerText(chargeElm, ".time .date")
    });
  });

  return invoiceCharges;
}

function main(options) {
  var invoices = getInvoices(options.processInvoices);
  invoices.forEach(function (invoiceElm) {
    var invoiceInfo = getInvoiceInfo(invoiceElm, options);
    console.log(invoiceInfo);
  });
}


/****************************************************************************/
/*                                 EXECUTION                                */
/****************************************************************************/

var options = {
  processInvoices: "current", // "current" or "all"
  currencySymbol: "R$",
  groups: [ "Uber" ],
  chargeSynonyms: [
    {
      from: "Christiano Amaral",
      to: "Distribuidora Super"
    },
    {
      from: "J.A.Meireles Comercio",
      to: "Mercadinho Super Mais"
    },
    {
      from: "Posto Vasconcelos",
      to: "Playboy Motel"
    },
    {
      from: "M Pestana da Gama",
      to: "Peixaria Chapéu da Bênção"
    },
    {
      from: "Kofopoulos Participaco",
      to: "Distribuidora de Carnes JK"
    },
    {
      from: "Lanc e Rest D Guste",
      to: "Restaurante e Lanchonete D'Guste"
    },
    {
      from: "Fabio Alves Pardo",
      to: "Mercadinho Mil Graus"
    },
    {
      from: "Evaldo Silva de Souza",
      to: "Bunitão Lanches"
    },
  ]
}

main(options);