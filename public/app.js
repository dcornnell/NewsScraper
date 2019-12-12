$(document).ready(
    $.get("/all").then(function(data) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
        }
    })
);