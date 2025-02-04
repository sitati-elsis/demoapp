const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const { User } = require('./models/associations'); // Ensure associations are set before syncing

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

console.log('Starting Sequelize sync...');
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database sync complete.');
    return User.findByPk(1);
  })
  .then((user) => {
    console.log('Checking if user exists...');
    if (!user) {
      console.log('Creating test user...');
      return User.create({ name: 'Max', email: 'testemail@test.com' });
    }
    return user;
  })
  .then((user) => {
    // console.log('User found/created:', user);
    return user.createCart();
    app.listen(3000);
  })
  .then((cart) => {
    console.log('Listening on port 3000');
    app.listen(3000);
  })
  .catch((err) => console.log('Error during sync:', err));
