$(document).ready(function() {
    $(document).foundation();

    $.get("/all").then(function(data) {
        for (let i = 0; i < data.length; i++) {
            const item = `<li class="accordion-item" data-accordion-item>
            <a href="#" class="accordion-title"><h5>${data[i].title}</h5></a>
            <div class="accordion-content" data-tab-content>
            <p>${data[i].description}</p>
            <a href="${data[i].link}"type="button" class="success button">Read more!</a>
            <textarea id="${data[i]._id}"></textarea>
            <a href="#" class="button comment" data='${data[i]._id}'>Leave a comment</a>
            </div>
            </li>`;

            $(".accordion").append(item);
        }
        Foundation.reInit("accordion");
    });

    $(document).on("click", ".comment", function() {
        console.log($(`textarea#${$(this).attr("data")}`).val());
        console.log($(this).attr("data"));
    });
});