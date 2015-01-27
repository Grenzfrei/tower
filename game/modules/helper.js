// Random Text Generator Super Class
var TextGen = (function () {
    // private static
    var nextId = 1;
    
    // constructor
    var cls = function (train_file) {
        // private
        var id = nextId++;
        var sg = new ROT.StringGenerator({words:true});
        
        var r = new XMLHttpRequest();
        r.open("get", "assets/text/"+train_file, true);
        r.send();

        r.onreadystatechange = function() {
            if (r.readyState != 4) { return; }

            var lines = r.responseText.split(" - ");
            while (lines.length) { 
                var line = lines.pop().trim();
                if (!line) { continue; }
                sg.observe(line); 
            }
        } 

        // public (this instance only)
        this.get_id = function () { return id; };
        this.get_sg = function () { return sg; };
    };

    // public static
    cls.get_nextId = function () {return nextId;};

    // public (shared across instances)
    cls.prototype = {
        make_text: function () { return this.get_sg().generate();}
    };

    return cls;
})();


// Random Name Generator
var NameGen = function(){};
NameGen.prototype = new TextGen("tolkien.txt");


exports.NameGen = function () {
  return new NameGen();
};
    