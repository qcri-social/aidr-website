
    Logger.prototype.clear = function() {
        this.el.textContent = '';
    };

    function Logger(id) {
        this.el = document.getElementById(id);
    }

    Logger.prototype.log = function(msg, opt_class) {
        logger.clear();
        var fragment = document.createDocumentFragment();
        var p = document.createElement('div');
        p.className = opt_class || 'info';
        p.innerHTML = msg;
        fragment.appendChild(p);
        $("table").fadeIn("slow");
        this.el.appendChild(fragment);
    };

    Logger.prototype.clear = function() {
        $("table").slideDown();
        this.el.textContent = '';
    };

    var logger = new Logger('log');

    $(document).ready(function() {
        var refreshRate = 5000;
        var autoRefresh = setInterval(
                function ()  // Call out to get the time
                {
                    $.ajax({
                        type: 'GET',
                        url: 'http://aidr-dev.qcri.org/AIDROutput/crisis/fetch/channels/latest?callback=jsonp',
                        dataType: 'jsonp',
                        success: renderList,
                        error: FailedRenderList,
                        jsonp: false,
                        jsonpCallback: "jsonp" // end success
                    });  // end ajax call
                }, refreshRate);// end check
    });


    function FailedRenderList() {
        //logger.clear();
        var defaultTextHtml =  '<div id="alert"><b>Contacting real time tagger classifier.</b>' ;
        document.getElementById('log').innerHTML=defaultTextHtml;
        $( "errMsg" ).css( "color", "red" );

    }

    function renderList(data) {
        console.log(data);

        var list = data == null ? [] : (data instanceof Array ? data : [data]);


        if(typeof list !='undefined' || list!= null ){
            if(list[0].nominal_labels != null || typeof list[0].nominal_labels != 'undefined'){
                var template = '';
                template = template +  '<table>';
                template = template +  '<tr><td colspan="2" class="header">' + list[0].crisis_name + '</td></tr>';
                template = template +  '<tr><td colspan="2" class="tweet">' + list[0].text + '</td></tr>';

                var appList =  list[0].nominal_labels== null ? [] : (list[0].nominal_labels instanceof Array ? list[0].nominal_labels : [list[0]].nominal_labels);

                $.each(appList, function(index, item) {

                    template = template +  '<tr><td class="msg" width="100px">Label/Confidence </td><td class="msg">' + item.label_name + '  ( Confidence : ' +  item.confidence  + ' )</td></tr>';
                });
                template =  template + '</table>';
                logger.log(template);
            }
            else{
                FailedRenderList();
            }
        }
        else{
            FailedRenderList();
        }
    }

