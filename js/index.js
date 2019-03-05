// When size is submitted by the user, call makeGrid()
$("#sizePicker").submit(function(e) {
  e.preventDefault();
  makeGrid();
  validateForm();
});

/**
 * @description Radio buttons select background for pixel art canvas.
 */
const RIVER_BACKGROUND = document.querySelector("#riverBackground");
const HUNTING_BACKGROUND = document.querySelector("#huntingBackground");
const WILLAMETTE_BACKGROUND = document.querySelector("#willametteBackground");
//TODO: fix equation so it only resets radio button on change, not whole total 
HUNTING_BACKGROUND.addEventListener(
  "change",
  function() {
    TABLE.css("background-image","url(https://res.cloudinary.com/dacjqekio/image/upload/v1523480547/Hunting.png)");
    $(".cost").val(0)
  },
  false
);

RIVER_BACKGROUND.addEventListener(
  "change",
  function() {
    TABLE.css(
      "background-image",
      "url(https://res.cloudinary.com/dacjqekio/image/upload/v1523392532/Columbia_River2.png)"
    );
    $('.cost').val(0);
  },
  false
);

WILLAMETTE_BACKGROUND.addEventListener(
  "change",
  function() {
    TABLE.css(
      "background-image",
      "url(https://res.cloudinary.com/dacjqekio/image/upload/v1523392861/Willamette_Valley.png)"
    );
    $('.cost').val(0);
  },
  false
);

/**
 * @description Creates a grid based on user input
 * @param {number} height
 * @param {number} weight
 */
//TODO: some rows overflow, but the value still equals the grid height. Other rows work. Why? Fix? All widths work...
//TODO: Change random number function to not repeat numbers

//User input
const INPUT_HEIGHT = $("#inputHeight");
const INPUT_WIDTH = $("#inputWeight");

//Table dimensions
const TABLE = $("#pixelCanvas");
let td = $("#pixelCanvas td");
let tr = $("#pixelCanvas tr");
let cellText;

/*
*@description create cells within available pixelCanvas space based on user input.
*/
//TODO: Finish json documentation
const makeGrid = () => {
  //Max height & width for pixel canvas
  const GRID_HEIGHT = $("#gridContainer").height();
  const GRID_WIDTH = $("#gridContainer").width();
  let max = 99;
  let min = 1;

  TABLE.empty();

  for (let i = 0; i < INPUT_HEIGHT.val(); i++) {
    let row = TABLE[0].insertRow(i);
    for (let j = 0; j < INPUT_WIDTH.val(); j++) {
      let cell = row.insertCell(j);
      //assign random value to cell, used to activate dysentery function.
      getRandom = Math.floor(Math.random() * (max - min + 1)) + min;
      cellText = document.createTextNode(
        Math.floor(Math.random() * (max - min + 1)) + min
      );
      cell.appendChild(cellText);
    }
  }
  //Calculate height and width of cells and assign to CSS
  tr.height(GRID_HEIGHT / INPUT_HEIGHT.val());
  td.width(GRID_WIDTH / INPUT_WIDTH.val());
};

/**
 *@description Color pixel canvas
 */
const COLOR = $("#colorPicker");
let isDown = false;

TABLE.mousedown(function() {
  isDown = true;
});

TABLE.mouseup(function() {
  isDown = false;
});

TABLE.on("click mouseover mousedown", "td", function(e) {
    if(e.button === 2) {
    $(this).css("background-color", "");
    } else if(isDown && e.button === 0) {
    $(this).css("background-color", COLOR.val());
  }   
});


/**
 *@description You died of dysentery, reload
 */

$("#dysentery").change(function() {
  if ($(this).is(":checked")) {
//TODO: Figure out how to unhighlight popup automatically
    function openSwal() {
      swal({
            title: "",
            showConfirmButton: false,
            width: 1900,
            imageUrl:
              "https://res.cloudinary.com/dacjqekio/image/upload/v1523480544/Tombstone.png",
            imageHeight: 500,
            imageAlt: "You have died of dysentery.",
            timer: 5000,
          }).then(function() {
            window.location.reload(true);
          })
    }
    TABLE.on("mouseover", "td", function() {
      $(this).each(function() {
        let death = $(this).html();
        if (death === "40" && isDown === true) {
          openSwal()
        }
      });
    });

    TABLE.on("click", "td", function() {
      $(this).each(function() {
        let death = $(this).html();
        if (death === "40") {
          openSwal()
        }
      });
    });
  }
});

/**
* @description Server side validation of width & height
* @param {number} INPUT_WIDTH
* @param {number} INPUT_HEIGHT
* @returns {boolean} valid value or alert
// TODO: It still executes the input... need to stop instead.
*/
const validateForm = () => {
  if (
    INPUT_WIDTH.val() < 100 ||
    INPUT_WIDTH.val() > 250 ||
    INPUT_HEIGHT.val() < 100 ||
    INPUT_HEIGHT.val() > 250
  ) {
    alert("Grid must be between 100x100 and 250x250");
    return false;
  }
};

/**
 * @description Crystal's General Store cost & total
 * @param {number}
 * @param {number}
 * @returns {boolean}
 */
let items = $("#crystalsGeneralStore tbody tr");
items.each(function(index) {
  let item = $(this);

  item.find(".buy").on("change", function() {
    let buy = item.find("[name=buy]").val();
    let price = item.find("[name=price]").val();
    let cost = parseInt(buy, 10) * parseFloat(price);

    if (!isNaN(cost)) {
      item.find(".cost").val(cost.toFixed(2));
      var grandTotal = 0;

      $(".cost").each(function() {
        var total = parseFloat($(this).val());
        grandTotal += isNaN(total) ? 0 : total;
      });

      $(".total").val(grandTotal.toFixed(2));
    }
  });
});
/**
 *@description Explain button
 */
document.getElementById("explainButton").addEventListener("click", function() {
  swal({
  type: "info",
  html:
    '<h5><a href="https://www.hmhco.com/oregon-trail">The Oregon Trail&reg;</a> Themed</h5>' +
    "<h2>Pixel Art Maker</h2>" +
    "As the legend goes, The Oregon Trail pioneered the way for educational computer games. Despite the many versions since it was released in 1974, when I think pixels I think, <q>I hope I don&rsquo;t die.</q><p>" +
    "Originally, my goal for the project was to build a grid within a container. Hoping that an unconventional approach would get me some street cred come scholarship decision time." +
    " From there, I had a lot of ideas (none of which made the project).<p>" +
    "Finally, I needed to figure out a design. Within a few attempts I remembered, design ain&rsquo;t my thang. The Oregon Trail came to my mind, and from there the project took its own direction.<p>" +
    "Parodying the opening scenes, you&rsquo;ll find the user input form resembles Matt&rsquo;s General Store and displays Independence, Missouri." +
    " You can choose between three classic scenes in the game. Hunting, crossing a river, and finally making it to Willamette Valley, Oregon.<p>" +
    "But beware. The Oregon Trail had unforeseen obstacles.<br>Broken bones, lost cattle, snake bites, and of course - the dreaded dysentery.<p>" +
    "Dysentery knew no bounds. It would attack out of nowhere, sparing no one. Not even artists. Often striking them down right in the middle of a painting. Good luck.",
  showCloseButton: true,
  focusConfirm: false,
  confirmButtonText: "Awesome!",
  width: 900,
  background: '#fcf488',
  });
});

/**
 *@description Custom color button
 */
document.getElementById("colorButton").addEventListener("click", function() {
  document.getElementById("colorPicker").focus();
  document.getElementById("colorPicker").value = "#FFFFFF";
  document.getElementById("colorPicker").click();
});
