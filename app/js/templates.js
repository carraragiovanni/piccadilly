this["JST"] = this["JST"] || {};

this["JST"]["listing"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"listing-description\" class=\"flex line\">\n    <p id=\"listing-description-text\" class=\"results-text\">description</p>\n    <p id=\"listing-description-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.short_description || (depth0 != null ? depth0.short_description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"short_description","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-address\" class=\"flex line\">\n    <p id=\"listing-address-text\" class=\"results-text\">address</p>\n    <p id=\"listing-address-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.displayable_address || (depth0 != null ? depth0.displayable_address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayable_address","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-price\" class=\"flex line\">\n    <p id=\"listing-price-text\" class=\"results-text\">price</p>\n    <p id=\"listing-price-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-beds\" class=\"flex line\">\n    <p id=\"listing-beds-text\" class=\"results-text\">beds</p>\n    <p id=\"listing-beds-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.num_bedrooms || (depth0 != null ? depth0.num_bedrooms : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"num_bedrooms","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-baths\" class=\"flex line\">\n    <p id=\"listing-baths-text\" class=\"results-text\">baths</p>\n    <p id=\"listing-baths-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.num_bathrooms || (depth0 != null ? depth0.num_bathrooms : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"num_bathrooms","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-url\" class=\"flex line\">\n    <a id=\"listing-url-value\" class=\"results-text\" target=\"_blank\" href="
    + alias4(((helper = (helper = helpers.details_url || (depth0 != null ? depth0.details_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"details_url","hash":{},"data":data}) : helper)))
    + ">url</a>\n</div> \n";
},"useData":true});