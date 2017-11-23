var detectObject = require("object-detection");
var { customImages } = require("./customImages.json");

customImages.forEach(function(customImage) {
  
  var customImageElement = document.createElement("option");
  
  customImageElement.value = customImage[0];
  customImageElement.innerHTML = customImage[1];
  document.querySelector("#imgCustom").appendChild(customImageElement);

});

function getImageName() {

  var imgSelectOption = document.querySelector("#imageSelectorForm").imageSelection.value;

  if (imgSelectOption === "examples") {
    var imgInfo = document.querySelector("#imgExamples").value;
    var imageName = imgInfo.split("-")[0];
  } else {
    var imageName = document.querySelector("#imgCustom").value;
  }

  return imageName;

}

function hideCriticalElements() {

  document.querySelectorAll(".critical").forEach(function(criticalElement) {
    criticalElement.setAttribute("hidden", true);
  });

}

function unhideCriticalElements() {

  document.querySelectorAll(".critical").forEach(function(criticalElement) {
    criticalElement.removeAttribute("hidden");
  });

}

function refresh(optimize, detail) {

  if (!optimize) {

    document.querySelectorAll("fieldset").forEach(function(fieldset) {
      fieldset.removeAttribute("hidden");
    });
  
    var sensitivity = document.querySelector("#sensitivity").value,
        tolerance = document.querySelector("#tolerance").value,
        imageName = getImageName();
    
    document.querySelector("#image").setAttribute("src", "/" + imageName);
    hideCriticalElements();
  } else {

    var sensitivity = detail.cur.sensitivity,
        tolerance = detail.cur.tolerance,
        imageName = detail.imageName

  }
  
  var config = { imageName, sensitivity, tolerance };

  detectObject(config)
    .then(function(base64ImgResponse) {

      if (!optimize) {

        var base64Img = base64ImgResponse.base64Img,
            tada = document.querySelector("#object");

        tada.setAttribute("src", "data:image/jpeg;base64," + base64Img);

        unhideCriticalElements();

      }

      return { 
        optimal: base64ImgResponse.optimal,
        optimalClusterSize: base64ImgResponse.optimalClusterSize
      };

    })
    .then(function(optimalInfo){
      
      if (optimize) {

        detail.optimal = optimalInfo.optimal;
        detail.optimalClusterSize = optimalInfo.optimalClusterSize;

        var event = new CustomEvent("optimize", { detail });

        document.dispatchEvent(event);
      }

    });

}

function clean() {
  document.querySelector("#image").removeAttribute("src");
  document.querySelector("#object").removeAttribute("src");
}

document.querySelector("#imageExamplesOption").addEventListener("change", function(event) {
  
  if (this.checked) {
    document.querySelector("#imgCustom").setAttribute("disabled", true);
    document.querySelector("#imgExamples").removeAttribute("disabled");
  }

});

document.querySelector("#imageCustomOption").addEventListener("change", function(event) {
  
  if (this.checked) {
    document.querySelector("#imgExamples").setAttribute("disabled", true);
    document.querySelector("#imgCustom").removeAttribute("disabled");
  }

});

document.querySelector("#imgExamples").addEventListener("change", function(event){
  
  var imgInfo = this.value;

  if (imgInfo) {

    var sensitivity = imgInfo.split("-")[1],
        tolerance = imgInfo.split("-")[2];

    document.querySelector("#sensitivity").value = sensitivity;
    document.querySelector("#sensitivitySetter").value = sensitivity;
    document.querySelector("#tolerance").value = tolerance;
    document.querySelector("#toleranceSetter").value = tolerance;

    refresh();
  } else {
    clean();
  }
  
});

document.querySelector("#imgCustom").addEventListener("change", function(event) {
  
  if (this.value) {
    refresh();
  } else {
    clean();
  } 
  
});

document.querySelector("#sensitivity").addEventListener("change", function(event) {
  
  document.querySelector("#sensitivitySetter").value = this.value;
  refresh();

});

document.querySelector("#sensitivitySetter").addEventListener("change", function(event) {

  if (this.value < 1) {
    this.value = 1;
  } else if (this.value > 100) {
    this.value = 100;
  }
  
  document.querySelector("#sensitivity").value = this.value;
  refresh();

});

document.querySelector("#tolerance").addEventListener("change", function(event) {
  
  document.querySelector("#toleranceSetter").value = this.value;
  refresh();

});

document.querySelector("#toleranceSetter").addEventListener("change", function(event) {
  
  if (this.value < 1) {
    this.value = 1;
  } else if (this.value > 100) {
    this.value = 100;
  }

  document.querySelector("#tolerance").value = this.value;
  refresh();

});

document.querySelector("#accuracy").addEventListener("change", function(event) {
  
  document.querySelector("#accuracySetter").value = this.value;

});

document.querySelector("#accuracySetter").addEventListener("change", function(event) {
  
  if (this.value < 1) {
    this.value = 1;
  } else if (this.value > 100) {
    this.value = 100;
  }

  document.querySelector("#accuracy").value = this.value;

});

document.addEventListener("optimize", function(event) {

  var detail = event.detail;
  var cur = detail.cur;
  
  if (detail.optimal && !detail.lastOptimal || detail.optimalClusterSize > detail.lastOptimalClusterSize) {
    
    detail.lastOptimal = cur;
    detail.lastOptimalClusterSize = detail.optimalClusterSize;

  }

  var step = detail.step;

  if (cur.tolerance-step > 1) {
    cur.tolerance -= step;
  } else if (cur.sensitivity+step < 100) {
    cur.sensitivity += step;
    cur.tolerance = 100;
    detail.optimizeProgress.value += detail.step;
  } else {
    // dispatch end event
    detail.optimizeProgress.value = 100;
    unhideCriticalElements();
    if (detail.lastOptimal) {
      document.querySelector("#sensitivity").value = detail.lastOptimal.sensitivity;
      document.querySelector("#sensitivitySetter").value = detail.lastOptimal.sensitivity;
      document.querySelector("#tolerance").value = detail.lastOptimal.tolerance;
      document.querySelector("#toleranceSetter").value = detail.lastOptimal.tolerance;
    } else {
      throw new Error("Done, but no optimal solution found");
    }
    refresh();
    throw new Error("Done! sensitivity: " + detail.lastOptimal.sensitivity + ", tolerance: " + detail.lastOptimal.tolerance);
  }

  refresh(true, detail);

});

document.querySelector("#optimize").addEventListener("click", function(event) {
  
  var accuracy = document.querySelector("#accuracy").value,
      optimizeProgress = document.querySelector("#optimize-progress"),
      imageName = getImageName();
  var step = 25 - accuracy * 25 / 100;
  
  var detail = {
    imageName,
    optimizeProgress,
    step,
    cur: {
      sensitivity: 1,
      tolerance: 100
    }
  };

  optimizeProgress.value = 0;
  hideCriticalElements();

  optimizeProgress.removeAttribute("hidden");

  refresh(true, detail);

});