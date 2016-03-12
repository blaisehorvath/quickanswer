"use strict";
/**
 * Created by blaise on 2016.03.06..
 */

const url = require('url');
const http = require('http');

let getInfoArr = function (inarr, outarr) {
     if (inarr[0] instanceof Array) {
         getInfoArr(inarr[0])
     }
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
                    related : response.RelatedTopics
                });
            });
        }).on('error', (e)=>{
            console.log("Got an error: ", e);
        });
    })
};