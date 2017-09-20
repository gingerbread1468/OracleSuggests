package com.oracle.orion.ml3.web.backing.secure.km;

import com.oracle.orion.ml.web.util.JSFUtils;
import com.oracle.orion.ml3.util.OrionParameterAccess;
import com.oracle.orion.ml3.web.log.LoggerUtil;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import java.net.MalformedURLException;
import java.net.URL;

import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;


public class OracleSuggests {

    KMPreference pref;
    String ulTagStart = "<ul>";
    String ulTagEnd = "</ul>";
    String userQueryParamName = "?userQuery=";
    String productIdParamName = "&productId=";
    String requestedSuggestionsParamName = "&requestedSuggestions=";
    
    //
    private int oracleSuggestsCount = 0;
    private static final Logger LOG = LoggerUtil.getLogger(OracleSuggests.class.getName());
    private String searchSuggestions = "";
    private String osUrl = "";
    private String queryString = "queryString";
    private String xmlData = "";
    private String htmlData = "";
    private String productLineIds = "";
    private String osUrlTemplate = "";
    
public OracleSuggests() {
     if (true) {
       try {
        //ExternalContext exc = FacesContext.getCurrentInstance().getExternalContext();
        //Map reqMap = exc.getRequestParameterMap();
        //osUrl = OrionParameterAccess.getValue("OS_URL");
        osUrl = "secret url";
        setQueryString(queryString);
        setOsUrlTemplate(osUrl + userQueryParamName + getQueryString() + requestedSuggestionsParamName + "10" );
        LOG.log(Level.INFO,"osUrlTemplate is " + osUrlTemplate);
        LOG.log(Level.FINE,"The url in the OracleSuggests constructor is " + getOsUrl());
        LOG.log(Level.FINE,"The xml in the OracleSuggests constructor is " + getXML());
        LOG.log(Level.FINE,"The html in the OracleSuggests constructor is " + getHTML());
       } catch (Exception ex) {
           LOG.log(Level.SEVERE,"Error in OracleSuggests constructor: ",ex);
       }
    } else {
        LOG.log(Level.FINE,"Oracle Suggests in the OracleSuggests constructor is disabled"); 
    }
}

    public String getSearchSuggestions() {
            return searchSuggestions;
    }
    public String getOracleSuggestsCount() {
        return Integer.toString(oracleSuggestsCount);
    }

    public void setOracleSuggestsCount(int oracleSuggestsCount) {
        this.oracleSuggestsCount = oracleSuggestsCount;
    }

    public void setOsUrl(String osUrl) {
        this.osUrl = osUrl;
    }

    public String getOsUrl() {
        return osUrl;
    }
 
    public void setQueryString(String queryString) {
        this.queryString = queryString;
    }

    public String getQueryString() {
        return queryString;
    }
    public void setXML() {
        try {
           URL url = new URL(getOsUrl()); 
           BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
           String line;
           while ((line = reader.readLine()) != null) {
               xmlData = xmlData + line;
           }
           reader.close();
       } catch (MalformedURLException e) {
           LOG.log(Level.SEVERE,"MalformedUrlException error in OracleSuggests.setXML ",e);
       }  catch (IOException e) {
           LOG.log(Level.SEVERE,"IO error in OracleSuggests.setXML ",e);
       }
    }
    public String getXML() {
        return xmlData;
    }
    
    public void setHTML() {
            //
        if (!"".equals(getXML())) {
            SAXBuilder builder = new SAXBuilder();
            Element suggestion = null;
            String  suggestionValue = "";
            Element row = null;
            List suggestions = null;
            try {
                Document document = builder.build(new ByteArrayInputStream(getXML().getBytes()));
                Element root = document.getRootElement();
                List options = root.getChildren("option");
                for (int i = 0; i < options.size(); i++) {
                    row = (Element) options.get(i);
                    suggestions = row.getChildren("literal");
                    for (int j = 0; j < suggestions.size(); j++) {
                        suggestion = (Element)suggestions.get(j);
                        suggestionValue = suggestion.getText();
                        htmlData = htmlData + "<li onClick=\"fill('" + suggestionValue + "')\">" + suggestionValue + "</li>";
                    }
                }
                if (!"".equals(htmlData)) {
                  htmlData = ulTagStart + htmlData + ulTagEnd;
                }
            
            } catch (Exception e) {
            LOG.log(Level.SEVERE,"Error in OracleSuggests.setHTML ",e);
          } 
        }
    }

    public String getHTML() {
        return htmlData;
    }

    public void setProductLineIds(String[] productLineIds) {
       for (int i = 0; i < productLineIds.length; i++) {
           this.productLineIds = this.productLineIds + productLineIds[i];
           if (i < (productLineIds.length - 1)) {
               this.productLineIds = this.productLineIds + ",";
           }
       }
    }

    public String getProductLineIds() {
        return productLineIds;
    }

    public void setOsUrlTemplate(String osUrlTemplate) {
        this.osUrlTemplate = osUrlTemplate;
    }

    public String getOsUrlTemplate() {
        return osUrlTemplate;
    }
    public static void main(String[] args) {
        OracleSuggests os = new OracleSuggests();
        System.out.println(os.getOsUrlTemplate());
    }
}
