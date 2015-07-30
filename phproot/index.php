<?php
date_default_timezone_set('Asia/Bangkok');
?>
<!DOCTYPE html>
<head>
    <script src="jquery-2.1.4.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {

      var makeRequest  = function(data,method,url){

            var successCallback;
	    var errorCallback; 

	    var jsonData= {};
	    if(data){
	     jsonData = JSON.stringify(data);
	    }

            $.ajax({
                url: url,
                async: false,
                contentType: "application/json; charset=UTF-8",
                data :jsonData ,
                type : method,
                success: successCallback,
                error : errorCallback
            });

            successCallback = function( data,  textStatus,  jqXHR )
            {
                console.log(data);
            }

            errorCallback =  function(jqXHR,textStatus, errorThrown )
            {
                    console.log(errorThrown);
            }
       };


        $("#btnMakeRequest").click(function(){
            makeRequest({name: 'Sci'},"post", "http://dev.codesanook.com/cs/api.ashx/");
        });

        $("#btnGetPostsRequest").click(function(){
		makeRequest(null,"GET", 
			"http://dev.codesanook.com/cs/api.ashx/posts/0/10?sort=desc");
        });


        }); //end jQuery document ready

    </script>
</head>
<body>

<p>
    <input type="button" id="btnMakeRequest" value=make request"/>
</p>
<p>
    <input type="button" id="btnGetPostsRequest" value="make get posts request"/>
</p>
</body>
</html>
