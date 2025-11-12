let stepGoal = 10000; // Daily step goal
let ctx = document.getElementById("donutChart").getContext("2d");

// Create Donut Chart
let donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Steps Taken", "Remaining"],
        datasets: [{
            data: [data1, stepGoal-data1], // Initial data
            backgroundColor: ["blue", "#ddd"], // Sky blue for steps
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "80%", // Makes the donut thinner
        plugins: {
            legend: { display: false } // Hide legend
        }
    }
});


let p=document.querySelector(".category");
let bar=document.querySelector(".progress-bar");
bmi=data2;
bmi=Math.round(bmi * 100) / 100;
    if(bmi<18.5)
    p.innerHTML=`${bmi}<br>Underweight`;
    else if(bmi>25)
    p.innerHTML=`${bmi}<br>Overweight`;
    else
    p.innerHTML=`${bmi}<br>Normal`;
    bmi=(bmi-10)*100/30;
    bar.setAttribute("style",`width:${bmi}%`);

