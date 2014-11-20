/**
 * File Uploader File
 *
 * @package  File Uploader
 * @author   Oliver Green <oliver@builddigital.net>
 * @license  http://www.gnu.org/copyleft/gpl.html GPL3
 * @link     http://builddigital.net
 */

/**
 * File Uploader 'Class'
 *
 * @package  File Uploader
 * @author   Oliver Green <oliver@builddigital.net>
 * @license  http://www.gnu.org/copyleft/gpl.html GPL3
 * @link     http://builddigital.net
 */
function FileUploader(url, opts)
{
    "use strict";

    /**
     * Custom error
     *
     * @param string message
     * @param Error error
     */
    function FileUploaderError(message, error) {
        this.name = "FileUploadError";
        this.message = (message || "");
        this.originalError = (error || null);
    }

    /**
     * Prototype our custom error
     *
     * @type Error
     */
    FileUploaderError.prototype = new Error();

    /**
     * XMLHttpRequest Object
     *
     * @var XMLHttpRequest
     */
    var xhr;

    /**
     * XMLHttpRequest Object Defaults
     *
     * @type object
     */
    var defaults = {
        requestMethod: 'POST',
        async: true,
        username: '',
        password: '',
        timeout: 20000,
        responseType: '',
    };

    /**
     * FormData Object
     *
     * @var FormData
     */
    var fd;

    /**
     * File input DOM elements to
     * check for files to upload
     *
     * @type array
     */
    var _files = [];

    /**
     * Name / Value pairs of POST
     * parameters to send
     *
     * { name: 'field1', value: 'value1' }
     *
     * @type array
     */
    var _fields = [];

    /**
     * Resets the class
     *
     * This should be called inbetween
     * multiple requests.
     *
     * @return void
     */
    function reset()
    {
        xhr = new XMLHttpRequest();
        xhr.timeout = opts.timeout;
        xhr.responseType = opts.responseType;
        fd = new FormData();
        _files = [];
        _fields = [];
        bindListeners();
    }

    /**
     * Binds up our events to the
     * underlying XMLHttpRequests
     *
     * @return void
     */
    function bindListeners()
    {
        xhr.upload.onprogress = function(e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            if (total !== 0) {
                exposed.onProgress(done, total);
            }
        };

        xhr.onreadystatechange = function(e) {
            if (4 == this.readyState) {
                if ('2' === String(this.status).substr(0,1)) {
                    exposed.onComplete(this.response);
                } else {
                    var msg = 'The server returned a bad status code. (' + this.status + ')';
                    exposed.onError(new FileUploaderError(msg, e));
                }
            }
            exposed.onReadyStateChange(e);
        };

        xhr.onerror = function(e) {
            exposed.onError(new FileUploaderError('A network error occured.', e));
        };

        xhr.ontimeout = function(e) {
            exposed.onTimeout(e);
        };
    }

    /**
     * Adds an array DOM file elements 
     * to the queue
     *
     * @param {array} files
     */
    function addFiles(files)
    {
        _files = _files.concat(files);
    }

    /**
     * Adds an array of Name / Value pair
     * objects to the queue.
     *
     * @param {array} fields
     */
    function addFields(fields)
    {
        _fields = _fields.concat(fields);
    }

    /**
     * Adds a single field to the queue
     *
     * @param {string} name
     * @param {string} value
     */
    function addField(name, value)
    {
        _fields.push({'name': name, 'value': value});
    }

    /**
     * Attaches files to the FormDat object
     *
     * @return void
     */
    function _attachFiles()
    {
        if (_files.length > 0) {
            for (var i = 0; i < _files.length; i++) {
                for (var k = 0; k < _files[i].length; k++) {
                    for (var f = 0; f < _files[i][k].files.length; f++) {
                        fd.append(_files[i][k].name, _files[i][k].files[f]);
                    }
                }
            }
        }
    }

    /**
     * Attaches fields to the FormData object
     *
     * @return void
     */
    function _attachFields()
    {
        if (_fields.length > 0) {
            for (var i = 0; i < _fields.length; i++) {
                fd.append(_fields[i].name, _fields[i].value);
            }
        }
    }

    /**
     * Performs the upload
     *
     * @param  {array} files
     * @param  {array} fields
     * @return void
     */
    function upload(files, fields)
    {
        exposed.onStart();

        if (typeof fields === 'object') {
            addFields(fields);
        }

        if (typeof files === 'object') {
            addFiles(files);
        }

        xhr.open(opts.requestMethod, url, opts.async, opts.username, opts.password);
        exposed.onOpen(xhr);

        _attachFiles();
        _attachFields();

        xhr.send(fd);
    }

    /**
     * Aborts the current request
     *
     * @return void
     */
    function abort()
    {
        xhr.abort();
    }

    /**
     * Public methods
     *
     * @type {Object}
     */
    var exposed = {
        onTimeout: function(e) {},
        onReadyStateChange: function(state) {},
        onProgress: function(complete, total) {  },
        onComplete: function(response) {},
        onError: function(e) {},
        onOpen: function(xhr) {},
        onStart: function() {},
        getXHR: function() { return xhr; },
        upload: upload,
        abort: abort,
        reset: reset,
        addField: addField,
        addFields: addFields,
        addFiles: addFiles,
    };

    /**
     * Start things up
     * @return void
     */
    opts = $.extend(defaults, opts);
    reset();

    return exposed;
}
