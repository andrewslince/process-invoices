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

function processChargeGroups(charges, groups) {
  var processedGroups = [];
  var mappedGroups = {};
  var groupCharges = {};
  var rewardsCharges = {};

  if (groups && groups.length) {
    charges.forEach(function(charge) {
      var chargeAmountRaw = charge.amount.raw;
      groups.forEach(function(group) {
        if (!mappedGroups[group]) {
          mappedGroups[group] = {
            qty: 0,
            amount: 0,
            charges: []
          };
        }

        if (charge.description.includes("Rewards")) {
          rewardsCharges[String(chargeAmountRaw).replace("-", "")] = charge;
          console.log("rewards charge", charge);
        }

        else if (charge.description.includes(groups)) {
          groupCharges[String(chargeAmountRaw)] = charge;
          console.log("group charge", charge);

          /*
          console.log(rewardsCharges[charge.amount.raw]);
          if (!rewardsCharges[charge.amount.raw]) {
            mappedGroups[group].qty++;
            mappedGroups[group].amount += parseFloat(charge.amount.raw);
            mappedGroups[group].charges.push(charge);
            console.log("olé", charge);
          } else {
            console.log("desconsiderado", charge);
          }
          */
        }

        if (rewardsCharges) {

        }
      });

      console.log("rewardsCharges", rewardsCharges);
      console.log("groupCharges", groupCharges);
    });


  }

  

  return processedGroups;
}

function getInvoices(type) {
  var invoicesSelector = (type === "all")

    // all invoices
    ? ".md-tab-content"

    // current invoice
    : "#" + document.querySelector(".md-tab-themed.active")
      .getAttribute("aria-controls");

  return Array.from(document.querySelectorAll(invoicesSelector));
}

function getInvoiceInfo(invoiceElm, options) {
  var summary = getInvoiceSummary(invoiceElm);
  var charges = getInvoiceCharges(invoiceElm, options);
  var groups = processChargeGroups(charges, options.groups);

  return {
    summary: summary,
    charges: charges,
    groups: groups
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