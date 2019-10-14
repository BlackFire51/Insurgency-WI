const ESC = String.fromCharCode(27);

function processLogProcessor(){
    this.RealLog=""
    this.ProcessedLog=""
    this.hideError=false;
    this.hideWaring=false;
    this.ignoreList=[]
    this.logPtr=0;
}

processLogProcessor.prototype.log= function(data,ptr) {
    if(data.length<1){return}
    if(ptr!=undefined){
        if(this.logPtr>=ptr){return}
        this.logPtr=ptr
    }
    this.RealLog+=data
    this.process(data)
}
//TODO: add localizer for time zone
processLogProcessor.prototype.process= function(data) {
    data=data.replace(/\n(\x1b\[0m)$/gm, ESC+"[0m") // place "empty" lines which are only reseting the text style at the end of the last line

    var regex_error = /\[.+]\[\d+\]([a-zA-Z0-9]+): (Error)/
    var regex_waring = /\[.+]\[\d+\]([a-zA-Z0-9]+): (Warning)/
    var regex_name = /\[.+]\[\d+\]([a-zA-Z0-9]+):/

    let Lines = data.match(/[^\r\n]+/g);
    Lines.forEach(l => {
        if( !(regex_error.test(l) && this.hideError) && !(regex_waring.test(l) && this.hideWaring)){
            var matches_array = regex_name.exec(l);
            if(matches_array!= null && matches_array.length>1){
                let str = matches_array[1].toLowerCase();
                if(!this.ignoreList.includes(str)){
                    this.ProcessedLog+=color(l)+"<br>\n"
                }
            }else if(matches_array== null){
                this.ProcessedLog+=color(l)+"<br>\n"
            }           
        }
    });
}

function color(str){
    str = str.replace(/\x1b\[31m/g, "<font color='red'>");  // red
    str = str.replace(/\x1b\[33m/g, "<font color='orange'>");  // yellow
    str = str.replace(/\x1b\[0m/g, "</font>");  // normal 
    return str
}