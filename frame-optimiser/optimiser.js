Packer = function(w, h, margin) {
    this.root = { x: margin, y: margin, w: w, h: h};
    this.margin = margin;
};

Packer.prototype = {
    fit: function(blocks) {
        var n, node, block;
        for (n = 0; n < blocks.length; n++) {
            block = blocks[n];
            if (node = this.findNode(this.root, block.w + this.margin, block.h + this.margin))
                block.fit = this.splitNode(node, block.w + this.margin, block.h + this.margin);
        }
    },

    findNode: function(root, w, h) {
        if (root.used)
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        else if ((w <= root.w) && (h <= root.h))
            return root;
        else
            return null;
    },

    splitNode: function(node, w, h) {
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
        return node;
    }

}
function Draw(data,x,y,w,h, imagedata){
    var c = document.getElementById("sizer");
    var ctx = c.getContext("2d");
    var myImage = new Image();
    myImage.src = data;
    ctx.drawImage(myImage, x, y, w, h);
}

function workOutBlocks(){
    var c = document.getElementById("sizer");
    var ctx = c.getContext("2d");
    width = Number(document.getElementById("width").value) // width of the canvas cm
    height = Number(document.getElementById("height").value) // height of the canvas cm

    c.width = 1.75*800*(width/(width+height)) // scale it up so it takes up a whole page
    c.height = 1.75*800*(height/(width+height)) //scale it up so it takes up a whole page
    blocks = [] // create empty array all the blocks will go in

    images = document.getElementById("images").children // get all the images
    for (i=0;i< images.length;i++){ // loop though all the images
        actualImg = images[i].children[0] // get the actual image
        curHeight = 800*1.75*Number(images[i].children[1].children[1].value)/(height+width) // get the height that the user wants the image to be and devide it by the scalar
        blocks.push({ w: curHeight*2*actualImg.width/(actualImg.width+actualImg.height)  , h: curHeight, data: actualImg.src}) // set the block to 
    }
    console.log(blocks)
    blocks.sort((a,b) => (Math.max(a.w,a.h) > Math.max(b.w,b.h))? -1:1)
    margin = Number(document.getElementById("margin").value)
    var packer = new Packer(c.width, c.height, 1.75*800*margin/(width+height));
    packer.fit(blocks);
    for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
            Draw(block.data, block.fit.x, block.fit.y, block.w, block.h);
        }
    }

}

/*
var blocks = [
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w: 100, h: 100 },
    { w:  80, h:  80 },
    { w:  80, h:  80 },
];
var packer = new Packer(800, 800, 10, 100, 100);
packer.fit(blocks);
for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
        Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
}
*/
