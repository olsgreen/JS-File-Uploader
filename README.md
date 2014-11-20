JS-File-Uploader
================

A light-weight, framework independent, cross browser HTML5 XMLHttpRequest file upload script with progress updates.

Chrome, Firefox, Safari & IE 10+ compatible.

##Useage
```
var uploader = new FileUploader('http://my.upload/url');

uploader.onError = function(e)
{
    // Show error
    alert('Ooops! Something went wrong: ' + e.message);
}

uploader.onProgress = function(bytesUploaded, bytesTotal)
{
    // Update progress bar
    $('#myProgressBar').css('width', ((complete / total) * 100) + '%');
}

uploader.onComplete = function(response)
{
    // Do something
}

uploader.upload($('#fileInput'));
```