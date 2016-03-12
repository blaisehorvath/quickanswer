"use strict";
/**
 * Created by blaise on 2016.03.06..
 */

const url = require('url');
const http = require('http');

//TODO: collectResult instead of Text and use the following regex to extract title if it exists
/*
 text.match(/\>([^"]+)(?=\<)/)
 [">Balázs Dzsudzsák", "Balázs Dzsudzsák"]
* */

let getInfoArr = function (relatedTopics) {

    let topics = [];
    topics[0] = {
        category : "Most relevant",
        data : []
    };

    let numberOfResults = 0;

    for (let item of relatedTopics) {
        if (item.Topics) {
            let subcategory = {
                category : item.Name,
                data : []
            };
            for (let subItem of item.Topics) {
                subcategory.data.push({
                    resultUrl : subItem.FirstURL,
                    data : subItem.Text,
                    id : ++numberOfResults
                })
            }
            topics.push(subcategory)
        } else {
            topics[0].data.push({
                resultUrl : item.FirstURL,
                data : item.Text,
                id : ++numberOfResults
            })
        }
    }
    return topics
};

module.exports = function (searchTerm) {
    return new Promise ((resolve)=>{
        let uri = 'http://api.duckduckgo.com/?q='+ encodeURIComponent(searchTerm) +'&format=json';
        let urlObj = url.parse(uri);

        http.get(urlObj, (res)=>{
            let body = '';

            res.on('data', (chunk)=>{
                body += chunk;
            });

            res.on('end', ()=>{
                let response = JSON.parse(body);
                resolve({
                    abstract : response.Abstract,
                    related : response.RelatedTopics,
                    extracted : getInfoArr(response.RelatedTopics)
                });
            });
        }).on('error', (e)=>{
            console.log("Got an error: ", e);
        });
    })
};