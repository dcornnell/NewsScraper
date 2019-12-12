$(document).ready(function() {
    $(document).foundation();

    $.get("/all").then(function(data) {
        data.forEach(function(article) {
            const item = `<li class="accordion-item" data-accordion-item>
            <a href="#" class="accordion-title"><h5>${article.title}</h5></a>
            <div class="accordion-content" data-tab-content>
            <p>${article.description}</p>
            <a href="${article.link}"type="button" class="success button">Read more!</a>
            <textarea id="${article._id}"></textarea>
            <a href="#" class="button comment" data='${article._id}'>Leave a comment</a>
            </div>
            </li>`;

            $(".accordion").append(item);
        });
        Foundation.reInit("accordion");
    });

    $(document).on("click", ".comment", function() {
        const comment = {};
        comment.user = "guest";
        comment.text = $(`textarea#${$(this).attr("data")}`).val();
        comment.articleID = $(this).attr("data");
        console.log(comment);
        $.ajax({
            url: "/comment",
            method: "POST",
            data: comment
        }).then(function(response) {
            console.log(response);
        });
    });
});