function habilitarNavBarMobile() {
    var x = document.getElementById("nav_bar_mobile");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}