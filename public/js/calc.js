let loanAmount = document.getElementById("input_value");
console.log(loanAmount.value);
let downPayment = document.getElementById("input_down_payment")
let interestRate=document.getElementById("input_interest");
let loanDuration = document.getElementById("input_duration");
let submit = document.getElementById("calculate");


submit.addEventListener('click',(e)=>{
    e.preventDefault();
    calculateEMI();
})

function calculateEMI(){
    let noOfMonths=loanDuration.value * 12 ;
    // First calculate total number of months in loan tenure if selected year
    // let isYear = document.getElementById("year").checked;
    // let isMonth = document.getElementById("month").checked;
    
    // if(isYear=="" && isMonth==""){
    //     alert("Please select loan tenure type-> Month or year");
    // }else{
    //     if(isYear==true){
    //         noOfMonths=loanDuration.value * 12 ;
    //     }else{
    //         noOfMonths=loanDuration.value;
    //     }

        let r = parseFloat(interestRate.value)/1200;
        let P = loanAmount.value;
        let n = noOfMonths;
        let a = downPayment.value;
        // let monInterest = (interestRate.value)/1200
        //formula EMI= (P * r * (1 + r)^n ) / ((1+r)^n - 1)
        let EMI = (P*r* Math.pow((1+r),n)) / (Math.pow((1+r),n)-1);
        let totalInterest =(EMI * n) - P;
        let totalPayment  = totalInterest + parseFloat(P);
        let remAmount = P - a ;
        document.getElementById("p-monthly-total").innerText = Math.round(EMI);
        document.getElementById("p-remain-dept").innerText = Math.round(remAmount);
        document.getElementById("p-pay-period").innerText = Math.round(noOfMonths);
        document.getElementById("p-m-rate").innerText = r.toFixed(4);
        document.getElementById("p-total-intrest").innerText= Math.round(totalInterest);
        document.getElementById("p-total-pay").innerText=Math.round(totalPayment) ;


    }

