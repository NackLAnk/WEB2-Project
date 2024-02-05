require('dotenv').config();
const express = require("express");
const session = require('express-session');

const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('./public/model/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
// const JWT_SECRET = process.env.JWT_SECRET || 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk';

fs.writeFileSync('.env', `JWT_SECRET=${JWT_SECRET}`,);

mongoose.connect('mongodb://localhost:27017/login-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json())

app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public/images/favicon/favicon.ico')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.get("/", (req, res) => {
  res.redirect("/home");
});

// функций, проверка, время, проверки на авторизацию и т.д.

//  проверка токена на подлиность
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ status: 'error', error: 'Token not provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 'error', error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// проверяет на наличие автаризаций пользователя, чтобы нельзя было попасть в /login /signin
function checkAuth(req, res, next) {
  if (req.session.userLoggedIn) {
    return res.redirect('/home');
  }
  next();
}

// проверяет, авторизован ли пользователь перед переходом на /profile
function requireAuth(req, res, next) {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// функция определяющяя время
function determineTime(req, res, next) {
  const currentTime = new Date();

  function isOpen(currentTime) {
    const hours = currentTime.getHours();
    return (hours >= 8 && hours < 23);
  }

  res.locals.currentTime = currentTime;
  res.locals.isOpen = isOpen(currentTime);

  next();
}

// это главная страница, по сути "/", но мне хочется чтобы было /home )))
app.get('/home', determineTime, function (req, res) {
  const { userRole, userEmail, userName, userLastName, userLoggedIn } = req.session;
  res.render('pages/index', {
    isOpen: res.locals.isOpen,
    userRole,
    userLoggedIn,
    userEmail,
    userName,
    userLastName
  });
});


// Обработчик для страницы входа
app.get("/login", checkAuth, (req, res) => {
  res.render("pages/login", {});
});

// Обработчик для страницы регистрации
app.get("/signUp", checkAuth, (req, res) => {
  res.render("pages/signUp", {});
});

// профиль будущего пользователя
app.get('/profile', requireAuth, (req, res) => {
  const { userEmail, userName, userLastName } = req.session;
  res.render('pages/profile', {
    userEmail,
    userName,
    userLastName
  });
});


// если пользователь хочет выйти

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/home');
    }
    res.redirect('/home');
  });
});

// api - login, register

// app.post('/api/change-password', async (req, res) => {
//   const { token, newpassword: plainTextPassword } = req.body

//   if (!plainTextPassword || typeof plainTextPassword !== 'string') {
//     return res.json({ status: 'error', error: 'Invalid password' })
//   }

//   if (plainTextPassword.length < 5) {
//     return res.json({
//       status: 'error',
//       error: 'Password too small. Should be atleast 6 characters'
//     })
//   }

//   try {
//     const user = jwt.verify(token, JWT_SECRET)

//     const _id = user.id

//     const password = await bcrypt.hash(plainTextPassword, 10)

//     await User.updateOne(
//       { _id },
//       {
//         $set: { password }
//       }
//     )
//     res.json({ status: 'ok' })
//   } catch (error) {
//     console.log(error)
//     res.json({ status: 'error', error: ';))' })
//   }

// })

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid email' })
  }

  if (await bcrypt.compare(password, user.password)) {
    // успешная аутентификация
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      JWT_SECRET
    )

    // Устанавливаем сессию после успешного входа
    req.session.userLoggedIn = true;
    req.session.userEmail = email;
    req.session.userName = user.first_name;
    req.session.userLastName = user.last_name;
    req.session.userRole = user.role;

    return res.json({ status: 'ok', data: token, userLoggedIn: true });
  }

  return res.json({ status: 'error', error: 'Invalid password' })
});

app.post('/api/register', async (req, res) => {
  const { first_name, last_name, email, password: plainTextPassword } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (first_name.length < 3 || first_name.length > 12) {
    return res.json({ status: 'error', error: 'First name should be between 3 and 12 characters' });
  }

  if (last_name.length < 3 || last_name.length > 12) {
    return res.json({ status: 'error', error: 'Last name should be between 3 and 12 characters' });
  }

  if (!emailRegex.test(email)) {
    return res.json({ status: 'error', error: 'Invalid email' });
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' });
  }

  if (plainTextPassword.length < 6) {
    return res.json({ status: 'error', error: 'Password too small. Should be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ status: 'error', error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    const newUser = new User({ first_name, last_name, email, password: hashedPassword });
    await newUser.save();

    req.session.userLoggedIn = true;
    req.session.userEmail = email;
    req.session.userName = first_name;
    req.session.userLastName = last_name;
    req.session.userRole = "user";

    res.json({ status: 'ok', userLoggedIn: true });
  } catch (error) {
    console.error('Error:', error);
    res.json({ status: 'error', error: 'Something went wrong' });
  }
});







app.listen(3000, () => {
  console.log(`App listening at http://localhost:${port}`);
})