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
        var accum = task.query.reduce(function(acc, query)
        {
            var hostname = query.hostname;
            if(hostname)
            {
                if(query.timer == null)
                {
                    acc["processed"] = (acc["processed"] || {});
                    acc["processed"][hostname] = (acc["processed"][hostname] || 0);
                    acc["processed"][hostname] += 1;
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
        if(accum["processed"])
        {
            accum["done"] = Object.values(accum["processed"]).reduce(function(acc, value)
            {
                return acc + value;
            }, 0);
        }
        accum["name"] = task.name;
        return accum;
    });
    console.log(JSON.stringify(res));
});
