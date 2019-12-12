$(document).ready(function() {
    $(document).foundation();

    $.get("/all").then(function(data) {
        for (let i = 0; i < data.length; i++) {
            const item = `<li class="accordion-item" data-accordion-item>
            <a href="#" class="accordion-title"><h5>${data[i].title}</h5></a>
            <div class="accordion-content" data-tab-content>
            <p>${data[i].description}</p>
            <a href="${data[i].link}">Read more!</a>
            </div>
            </li>`;

            $(".accordion").append(item);
        }
        Foundation.reInit("accordion");
    });
});