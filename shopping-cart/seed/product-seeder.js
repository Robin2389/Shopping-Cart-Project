var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );

var products = [

    new Product({
        imagePath: "https://cdn0.woolworths.media/content/wowproductimages/large/105919.jpg",
        title: 'Apples',
        description: 'An apple a day...',
        price: 1
    }),

    new Product({
        imagePath: "https://nearfarms.com/wp-content/uploads/2018/09/navel-org.png",
        title: 'Oranges',
        description: 'Great for making juice!',
        price: 10
    }),

    new Product({
        imagePath: "https://images-na.ssl-images-amazon.com/images/I/71gI-IUNUkL._SY355_.jpg",
        title: 'Bananas',
        description: 'Delicious addition to any smoothie',
        price: 300
    }),

    new Product({
        imagePath: "https://cdn1.medicalnewstoday.com/content/images/articles/274/274620/two-peaches.jpg",
        title: 'Peaches',
        description: 'Great for iced tea',
        price: 10
    }),

    new Product({
        imagePath: "https://cdn.shopify.com/s/files/1/0206/9470/products/Strawberries-group-done_1024x1024.jpg?v=1496636819",
        title: 'Strawberries',
        description: 'Have you tried them with chocolate',
        price: 20
    }),

    new Product({
        imagePath: "https://images-na.ssl-images-amazon.com/images/I/61HOcZM6yBL._SL1373_.jpg",
        title: 'Pears',
        description: 'Calm and zen-like',
        price: 5
    })

];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}

