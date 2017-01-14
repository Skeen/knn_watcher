#!/usr/bin/env node
'use strict';

var parse_json = function(callback)
{
    var readline = require('readline');
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    var input = "";
    rl.on('line', function(line)
    {
        input += line;
    });

    rl.on('close', function()
    {
        var json;
        try
        {
            json = JSON.parse(input);
        }
        catch(err)
        {
            console.error();
            console.error("Fatal error: Piped input is not valid JSON!");
            console.error();
            console.error(err);
            process.exit(1);
        }

        callback(json);
    });
};

parse_json(function(json)
{
    var res = json.map(function(task)
    {
        var res = task.query.reduce(function(acc, query)
        {
            var hostname = query.hostname;
            if(hostname)
            {
                if(query.timer == null)
                {
                    acc["done"] = (acc["done"] || {});
                    acc["done"][hostname] = (acc["done"][hostname] || 0);
                    acc["done"][hostname] += 1;
                }
                else
                {
                    acc["processing"] = (acc["processing"] || 0);
                    acc["processing"] += 1;
                }
            }
            else
            {
                acc["queued"] = (acc["queued"] || 0);
                acc["queued"] += 1;
            }
            
            return acc;
        }, {});
        res["name"] = task.name;
        return res;
    });
    console.log(JSON.stringify(res));
});
