"use strict";
/**
 * Created by blaise on 2016.03.06..
 * This module can fetch data from the duckduckgo quickanswer API. The fetched data objects are hold in array of category objects.
 */

const url = require('url');
const http = require('http');


/**
 * This function extracts the data from the newly fetched raw JSON object and returns the result.
 * @param {Object} infoObject JSON formatted object fetched via http request.
 * @returns {{resultUrl: *, data: *, title: *}} An object that contains the title, data, and the URL.
 */
const extractInfo = function(infoObject) {

    /* Extracting the title that is located in the anchor tag */
    let titleArr = infoObject.Result.match(/\>([^"]+)(?=\<)/);
    let title;

    if (title !== null) {
        title = titleArr[1]
    } else {
        title = ""
    }

    /* Removing the title from the text */
    let text = infoObject.Text;

    text = text.replace((/\<.+\>/,""));

    return {
        resultUrl : infoObject.FirstURL,
        data : text,
        title : title
    }

};

/**
 * This function returns array of categori(es) that contain(s) the result(s).
 * @param {Object} relatedTopics A JSON object that contains the results fetched from the http request.
 * @returns {Array}
 */
const getInfoArr = function (relatedTopics) {

    /* Initiating an empty array that will hold the data*/

    let topics = [];
    topics[0] = {
        category : "Most relevant",
        data : []
    };

    /* Looping trough the results */
    for (let item of relatedTopics) {

        /* If the current has nested items in a subcategory, then the contents of the subcategory  are extracted by a recursive function call */
        if (item.Topics) {

            let subcategory = {
                category : item.Name,
                data : []
            };

            for (let subItem of item.Topics) {
                subcategory.data.push(extractInfo(subItem))
            }

            topics.push(subcategory)

        /* It it's just a simple item (not the part of a topic) it's pushed to the main topic */
        } else {

            topics[0].data.push(extractInfo(item))
        }
    }
    return topics
};

/**
 * This function executes a http query on the Duckduckgo quickanswer API based on the given parameter.
 * @param {string} searchTerm The expression that is being searched.
 * @returns {Promise} A promise that when fullfilled will hold the result of the search.
 */

module.exports = function (searchTerm) {
    return new Promise ((resolve)=>{
        /* Assembling the query */
        let uri = 'http://api.duckduckgo.com/?q='+ encodeURIComponent(searchTerm) +'&format=json';
        let urlObj = url.parse(uri);

        /* Sending the request and setting up listeners to the answer, when the transmission finished resolving the Promise */
        http.get(urlObj, (res)=>{
            let body = '';

            res.on('data', (chunk)=>{
                body += chunk;
            });

            res.on('end', ()=>{
                let response = JSON.parse(body);
                resolve({
                    mainAnswer : response.Abstract,
                    related : getInfoArr(response.RelatedTopics)
                });
            });
        }).on('error', (e)=>{
            console.log("Got an error: ", e);
        });
    })
};