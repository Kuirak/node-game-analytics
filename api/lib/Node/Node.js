'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 *
 */
var stream = require('stream')
    ,util = require('util');

util.inherits(Demux,stream.Writable);
/**
 * Demultiplexer - wird in der Nodeklasse verwendet und teilt das Ergebnis des TransformStreams wieder auf.
 * @param outputs Das outputs array von der Nodeklasse
 * @constructor
 */
function Demux(outputs){
    stream.Writable.call(this,{objectMode:true});
    this.outputs=outputs;
}

Demux.prototype._write =function(chunk,enc,next){
    _.each(chunk,function(output){
        this.outputs[output.name].write(output);
    },this);
    next();
};

/**
 *  Abstrakte Basisklasse für Nodes
 * @param id Die id des Nodes im System
 * @param options Optionsobjekt - beinhaltet input und output definitionen und eine Instanz des verwendeten Transformstreams.
 * @constructor
 */
function Node(id,options){
    var self =this;
    self.id =id;
    options = options ||{inputs:[{name:'value',type:'number'}],outputs:[{name:'value',type:'number'}]};
    self.outputs ={};
    self.inputs =options.inputs;
    self.sources ={};
    self.transform = options.transform || new stream.PassThrough({objectMode:true});
    if(options.outputs){
        self.demux = new Demux(self.outputs);
        self.transform.pipe(self.demux);
        _.each(options.outputs,function(output){
            if(self.outputs[output.name])return;
            self.outputs[output.name] = new stream.PassThrough({objectMode:true});
        });
    }
}
/**
 * fügt einen Stream in das Sourcesdictionary ein
 * @param inputname Name des Inputs
 * @param previousNodeOutputStream der Readable stream des vorhergehenden Nodes
 */
Node.prototype.attachInput =function(inputname,previousNodeOutputStream){
    var self =this;
    if(_.isNull(previousNodeOutputStream) || _.isUndefined(previousNodeOutputStream)){
        throw new Error("Stream doesn't exist " +inputname)
    }
    if(!_.some(self.inputs,{name:inputname})){
        throw new Error("This input doesn't exist " +inputname);
    }
    self.sources[inputname]=previousNodeOutputStream;
};



/**
 * wird aufgerufen wenn alle inputs angehängt wurden
 */
Node.prototype.setupInputs =function(){
    var data={};
    var self =this;
    var constant={};

    function checkIfAllData() {
        //Sind alle Daten vorhanden?
        if (_.size(data) === _.size(self.sources)) {
            // an TransformStream senden
            self.transform.write(data);
            // Datenpuffer zurücksetzen
            data = {};
            //Streams fortsetzen
            _.each(self.sources, function (input) {
                if (input instanceof stream.Readable) {
                    input.resume();
                } else {
                    data = _.clone(constant);

                }
            });
        }
    }

    _.forIn(self.sources,function(input,name){
        // Falls kein Stream sondern Konstante
        if(!(input instanceof stream.Readable)){
            constant[name]={name:name,data:input};
            data = _.assign(data,constant);
            checkIfAllData();
        }else{
        //Eventlistener wenn der Inputstream Daten hat
        input.on('data',function(chunk){
            if(!chunk.data){
                return;
            }
            input.pause();
            //den Inputname setzen und in den Datenpuffer speichern
            chunk.name =name;
            data[name]=chunk;
            checkIfAllData();
        });
        }
    });
};

module.exports =Node;