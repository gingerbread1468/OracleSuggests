var t;
var currIndex = -1;
var currSuggestion = "";
var ctr = 0;
var suggestion = "";
var score   = "";
var searchSuggestions = "";
var ulTagStart = "<ul>";
var ulTagEnd  = "</ul>";
var textBoxContent = "";
var osUrl = "";
var osUrlTemplate = "";
var queryString = "queryString";

$(document).ready(function() {
  $(document.body)
  .prepend('<div id="searchBar__searchSuggestions" class="searchBar__searchSuggestionsStyle">');
   positionSuggestions();
   $("input[id$='searchBar__keywordsInputText']").attr("autocomplete","off");
  $(window).resize(function() {
    positionSuggestions();
  });
  $("input[id$='searchBar__keywordsInputText']").mouseleave(function(e){
   t=setTimeout("$(\"div[id$='searchBar__searchSuggestions']\").fadeOut('slow');",1000);
  });
  $("div[id$='searchBar__searchSuggestions']").mouseleave(function(e){
   t=setTimeout("$(\"div[id$='searchBar__searchSuggestions']\").fadeOut('slow');",1000);
  });
  $("input[id$='searchBar__keywordsInputText']").mouseenter(function(e){
    clearTimeout(t);
  });
  $("div[id$='searchBar__searchSuggestions']").mouseenter(function(e){
    clearTimeout(t);
  });
   
   $("input[id$='searchBar__keywordsInputText']").keyup(function(e) {
   	  switch(e.which) { //with jquery e.which works on both FF and IE
	  	case 38: //up arrow
		   checkKey(38);
		   e.stopImmediatePropagation();
		   break;
		case 40: //down arrow
		  checkKey(40);
		  e.stopImmediatePropagation();
		  break;
		case 13: //enter key
		   checkKey(13);
		   e.stopImmediatePropagation();
		   e.preventDefault();
		   break;
		 case 37: //left arrow
		   e.stopImmediatePropagation();
		   break;
		 case 39: //right arrow
		   e.stopImmediatePropagation();
		   break;
		default:
		  lookupSuggestions(this.value);
	  }
   });
  });
  function setContextPath(cPath) { //This is called when the onfocus event occurs on the search input text field
     contextPath = cPath;
	 //Get the url to the TimesTen server
	 $.post(contextPath + "/faces/secure/km/OracleSuggests.jspx", function(data){
	 	if (data.length > 2) {
                  osUrlTemplate = data;
		} else {
		  osUrlTemplate = "";
		}
      });
  }
  function checkKey(keycode){
    switch(keycode) {
        case 38: //up arrow 
            if (ctr == 0) break;
            handleUpArrow();
            break;
        case 40: //down arrow 
            if (ctr == 0) break;
            handleDownArrow();
            break;
        case 13: //enter
            //$("div[id$='searchBar__searchSuggestions']:hidden").each(function() {
              //$("button[id$='searchBarButton']").click(); 
              //return false;
            //});
            hideSuggestions();
            $("button[id$='searchBarButton']").click(); 
            break;
    }
   }
function hideSuggestions() {
  currIndex = -1;
  ctr = 0;
  $("div[id$='searchBar__searchSuggestions']").hide();
}
 function positionSuggestions() {
   var pos = $("input[id$='searchBar__keywordsInputText']").offset();  
   var height = $("input[id$='searchBar__keywordsInputText']").outerHeight();
   
   var borderWidth = $("input[id$='searchBar__keywordsInputText']").outerWidth();
   var paddingWidth = $("input[id$='searchBar__keywordsInputText']").innerWidth();
   var contentWidth = $("input[id$='searchBar__keywordsInputText']").width();
   var padding = paddingWidth - contentWidth;
   var borders = borderWidth - paddingWidth;
   
   $("div[id$='searchBar__searchSuggestions']").css( { "left": (pos.left - (borders/2)) + "px", "top": (pos.top + height) + "px"} );
 }
function handleDownArrow() {
	if (currIndex == (ctr - 1)) { //we are on the last suggestion
	  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).removeClass("searchBar__searchSuggestionsArrowOver"); 
	  currIndex = -1;
	  currSuggestion = textBoxContent;
	} else if(currIndex == -1) {
	  $("div[id$='searchBar__searchSuggestions'] li").eq(++currIndex).addClass("searchBar__searchSuggestionsArrowOver");
	  currSuggestion = $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).text();		  
	} else { 
	  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).removeClass("searchBar__searchSuggestionsArrowOver"); 
	  currSuggestion = $("div[id$='searchBar__searchSuggestions'] li").eq(++currIndex).text();	
	  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).addClass("searchBar__searchSuggestionsArrowOver"); 
	}    
    $("input[id$='searchBar__keywordsInputText']").val(currSuggestion); 
}
function handleUpArrow() {
 if (currIndex > 0) {
  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).removeClass("searchBar__searchSuggestionsArrowOver"); 
  currSuggestion = $("div[id$='searchBar__searchSuggestions'] li").eq(--currIndex).text();	
  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).addClass("searchBar__searchSuggestionsArrowOver"); 
 } else if(currIndex == 0) {
  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex--).removeClass("searchBar__searchSuggestionsArrowOver");
   currSuggestion = textBoxContent;		  
 } else { //highlight the last suggestion in the box
  currIndex = ctr - 1;
  currSuggestion = $("div[id$='searchBar__searchSuggestions'] li")[currIndex].innerHTML;
  $("div[id$='searchBar__searchSuggestions'] li").eq(currIndex).addClass("searchBar__searchSuggestionsArrowOver"); 
 }    
 $("input[id$='searchBar__keywordsInputText']").val(currSuggestion); 
}
function fill(textValue) {
 $("input[id$='searchBar__keywordsInputText']").val(textValue); 
 hideSuggestions();
 $("button[id$='searchBarButton']").click(); 
}
function countSuggestions() {
  return $("div[id$='searchBar__searchSuggestions'] li").length;
}
function parse(xmlData) {
  var data;
  if (typeof xmlData == 'string') {
        data = new ActiveXObject('Microsoft.XMLDOM');
        data.async = false;
        data.loadXML(xmlData);
  } else {
        data = xmlData;
  }				  
  searchSuggestions = "";
  ctr = 0;
  $(data).find('option').each(function(){
    ctr++;
    suggestion = $(this).find('literal').text();
    searchSuggestions = searchSuggestions + "<li onClick=\"fill('" + suggestion + "')\">" + suggestion +"</li>";
   }); //close each(
  if (ctr > 0) {
    $("div[id$='searchBar__searchSuggestions']").html(ulTagStart + searchSuggestions + ulTagEnd).show();
  }
}
function lookupSuggestions(inputString) {
    textBoxContent = inputString;
    if (osUrlTemplate.length == 0) {
            // Hide the suggestion box.
            hideSuggestions();
    }
    else {
     osUrl = osUrlTemplate.replace(queryString,inputString);
     $.ajax({
     type: "GET",
     //contentType: "application/xml; charset=utf-8",
     url: encodeURI(osUrl),
     //cache: "false",
     dataType: (jQuery.browser.msie) ? 'text' : 'xml',
     success: parse,
     error: function(xmlHttpRequest, textStatus, errorThrown){
            $("#messages").html("error : " + textStatus + "," + errorThrown + "," + xmlHttpRequest.getResponseHeader() + "," + xmlHttpRequest.statusText + "," + xmlHttpRequest.status);
     }       
    });
    }
} // lookupSuggestions	