var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
  imagePath: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png",
  title: 'Gothic Video Game',
  description: 'Awesome Game!!!',
  price: 10
}),
new Product({
imagePath: "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTc5o.Gms14yKJcD4Yna5HIccFnKcFU7N.HfH0oe2YIHkEMJO3S84KD_nC5TwPJ5480dUQAJHc.Ogt9Xhli_UCxvZgkK9.kordYm.dkORgpMthj.DlcJTAFdFgX6Y33IItQTCI3Xqh3gz1KG4PYhcN_na.A1pP8axq13W84z3AUHjA-&h=225&w=150&format=jpg",
title: 'EA Fifa 19',
description: 'EA gets out another awesome game!!!',
price: 20
}),
new Product({
imagePath: "https://i.ytimg.com/vi/_VeAPv5CCGI/maxresdefault.jpg",
title: 'Need For Speed',
description: 'Awesome game for speed lovers!!!',
price: 10
})
];

var done = 0;
for(var int i=0;i<producrs.length;i++){
  products[i].save(function(err,result){
    done++;
    if(done === products.length){
      exit();
    }
  });

}
function exit(){
  mongoose.disconnect();
}
