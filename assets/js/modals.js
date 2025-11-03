function ProjectModal(project_) {
    var project_ = project_;
    var type = "modal";
    var func = "project";
//     console.log("In Project Modal");
    $.ajax({
        url: "",
        type: "POST",
        data: {
            type: type,
            function: func,
            project: project_
        },
        success: function (data) {
//             console.log(data);
            setTimeout(function () {
                $("#ProjectModalContent").html(data);
                $("#ProjectModal").modal('show');
            }, 1000);
        },
        error: function () {
            console.log("failed to send the data");
        }
    });
    
}
