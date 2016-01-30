function deleteBlog(id, element) {
    if (confirm("Are you sure?")) {
        $.ajax({
            url: "http://"+location.host+"/api/blogs/"+id,
            method: "delete",
            success: function() {
                $(element).parents("tr").remove();
            },
            error: function() {
                alert("Cannot delete blog, error");
            }
        });
    }
}