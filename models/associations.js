const User = require('./user');
const Product = require('./product');
const Cart = require('./cart');
const CartItem = require('./cart-item');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

module.exports = { User, Product, Cart, CartItem };
