tinymce.init({
    selector: '#post-editor',
    toolbar: 'undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat',
    menubar: false,
    height: 300,
    plugins: "table link image code fullscreen charmap",
    autosave_interval: "10s",
    images_upload_url: '/create-post',
    external_plugins: {
        'tiny_mce_wiris': 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
    }
    // images_upload_handler: (blobInfo, success, failure) => {
    //     let xhr;
    //     let formData;

    //     xhr = new XMLHttpRequest();
    //     xhr.withCredentials = false;
    //     xhr.open("POST", "/upload");

    //     xhr.onload = () => {
    //         let json;

    //         if (xhr.status != 200) {
    //             failure("HTTP Error: " + "xhr.status");
    //             return;
    //         }

    //         json = JSON.parse(xhr.responseText);

    //         if (!json || typeof json.location != "string") {
    //             failure("Invalid JSON: " + xhr.responseText);
    //             return;
    //         }

    //         success(json.location);

    //         formData = new formData();
    //         formData.append("file", blobInfo.blob(), blobInfo.filename());

    //         xhr.send(formData);
    //     }
    // }
});