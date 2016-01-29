var results = $("p#info")

$("form#uploader").submit(function (e) {
    e.preventDefault();
    var files = $("input#file")[0].files;
    var rename = $("input#rename").val();

    if (files.length == 0) {
        results.html("You need to select a file to upload!");
    } else {
        var file = files[0];
        results.html(
            "Starting to upload file:<br><blockquote>"
            + file.name + "<br>"
            + "size: " + file.size / 1024 + "KB<br>"
            + "type: " + file.type + "</blockquote>"
        );
        $("div#preloader").addClass("show");

        if (file.type.indexOf("image") >= 0) {
            results.append(
                $("<img />")
                    .attr("src", URL.createObjectURL(file))
                    .attr("alt", "preview of uploaded image")
            );
        }

        // upload file
        var fd = new FormData();
        if (rename != "" && rename != null) {
            fd.append("rename", encodeURI(rename.replace(/\s/g, "_")));
        }
        fd.append("file_upload", file, file.name);


        $.ajax({
            url: "/data/uploads",
            type: "put",
            processData: false,
            contentType: false,
            dataType: "text",
            data: fd,
            success: function (data, status, jqXHR) {
                $("div#preloader").removeClass("show");
                if (data.indexOf("success") >= 0) {
                    results.html("File has been uploaded as " + data.split(":").pop());
                } else {
                    results.html("There has been an error from the sever!<br>Status: " + jqXHR.status + " " + status + "<br><b>" + data + "</b>");
                }
            },
            error: function (jqXHR, status, error) {
                results.html("Error #" + jqXHR.status + ": " + error);
                $("div#preloader").removeClass("show");
            }
        });

    }
    console.log(files);

});

$("button#refresh").click(function (e) {
    e.preventDefault();
    $.ajax({
        url: "/data/uploads",
        type: "get",
        dataType: "json",
        success: function (data) {
            console.log(data);
            results.html("File list updated");
            $("#fileList").empty();
            data.forEach(function (val, index) {
                $("#fileList")
                    .append(
                    $("<li />")
                        .html(val)
                );
            });
        },
        error: function (jqXHR, status, err) {
            reslts.html("Erorr updating file list: " + jqXHR.status + " " + err);
        }
    });
});
