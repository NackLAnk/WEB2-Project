const express = require("express");

// cookie-parser
const cookieParser = require('cookie-parser');

// express-session
const session = require('express-session');
const { check, validationResult } = require('express-validator');

// path
const path = require('path');

// fs
const fs = require('fs');

// favicon
const favicon = require('serve-favicon');

// bodyparser
const bodyParser = require('body-parser');

// multer
const multer = require('multer');

// mongoose
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

// hash variables
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// models
const User = require('./public/model/user');
const Post = require('./public/model/post');
const Menu = require('./public/model/menu');
const Rating = require('./public/model/rating');

// jwt secret
require('dotenv').config();
const jwt = require('jsonwebtoken');
const envData = fs.readFileSync('.env', 'utf8');
// const lines = envData.split('\n');
// const JWT_SECRET = crypto.randomBytes(64).toString('hex');
const JWT_SECRET =  'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk';

// let updatedEnvData = lines
//   .map(line => {
//     if (line.startsWith('JWT_SECRET=')) {
//       return `JWT_SECRET=${JWT_SECRET}`;
//     }
//     return line;
//   })
//   .join('\n');

// session secret

const sessionSecret = crypto.randomBytes(64).toString('hex');

// fs.writeFileSync('.env', updatedEnvData);

// mongoose connect
mongoose.connect('mongodb+srv://nacklank:Gasek123@atlascluster.8lfm3uv.mongodb.net/dbweb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const store = new MongoDBStore({
  uri: 'mongodb+srv://nacklank:Gasek123@atlascluster.8lfm3uv.mongodb.net/dbweb?retryWrites=true&w=majority',
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log(error);
});


// app variable
const app = express();
const port = 3000;

const createPath = (page) => path.resolve(__dirname, 'views/pages', `${page}.ejs`);
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(cookieParser());

app.use(favicon(path.join(__dirname, 'public/images/favicon/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: store
}));


// redirect to --> /home
// app.get("/", (req, res) => {
//   res.redirect("/home");
// });

// функций, проверка, время, проверки на авторизацию и т.д.

const uploadPath = path.join(__dirname, 'public', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// проверяет на наличие автаризаций пользователя, чтобы нельзя было попасть в /login /signin
function checkAuth(req, res, next) {
  if (req.session.userLoggedIn) {
    return res.redirect('/');
  }
  next();
}

// проверяет, авторизован ли пользователь перед переходом на /profile
function requireAuth(req, res, next) {
  if (!req.session.email) {
    return res.status(401).render(createPath('error'), { errorCode: 401, errorMessage: 'Unauthorized' });
  }
  next();
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
app.get('/', determineTime, function (req, res) {
  const { userLoggedIn, email } = req.session;
  Menu.find()
    .sort({ createdAt: -1 })
    .then((menu) => {
      if (userLoggedIn) {
        User.findOne({ email })
          .then((user) => {
            res.render(createPath('index'), {
              isOpen: res.locals.isOpen,
              userLoggedIn,
              user,
              menu,
              currentUrl: req.url
            });

          })
          .catch(err => {
            // Обработка ошибок при запросе к базе данных
            console.error(err);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.render(createPath('index'), {
          isOpen: res.locals.isOpen,
          userLoggedIn,
          menu,
          currentUrl: req.url
        });
      }
    })

});


// Обработчик для страницы входа
app.get("/login", checkAuth, (req, res) => {
  res.render(createPath('login'), {});
});

// Обработчик для страницы регистрации
app.get("/signUp", checkAuth, (req, res) => {
  res.render(createPath('signUp'), {});
});

// профиль пользователей
app.get('/profile', requireAuth, (req, res) => {
  const { email, userLoggedIn } = req.session;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // Если пользователь не найден, отправьте статус 404 "Not Found"
        return res.status(404).send('User Not Found');
      }
      // Отрендерить шаблон с данными пользователя
      res.render(createPath('profile'), {
        user,
        userLoggedIn,
        currentUrl: req.url
      });
    })
    .catch((err) => {
      // Обработка ошибок запроса к базе данных
      console.error('Error finding user:', err);
      res.status(500).send('Internal Server Error');
    });
});


// getter блога и его потомки
app.get('/blog/:id', (req, res) => {
  const title = 'Post';
  Post
    .findById(req.params.id)
    .then((post) => res.render(createPath('post'), { post, title, currentUrl: req.url }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/blog', determineTime, (req, res) => {
  const { email, userLoggedIn } = req.session;
  const title = 'Posts';

  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => {
      User.findOne({ email })
        .then((user) => {
          res.render(createPath('blog'), {
            posts,
            title,
            isOpen: res.locals.isOpen,
            userLoggedIn,
            user,
            currentUrl: req.url
          });
        })
        .catch((error) => {
          console.log(error);
          res.render(createPath('error'), { title: 'Error' });
        });
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.delete('/blog/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(404).send('Статья не найдена');
      }
      return res.json({ status: 'ok' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Произошла ошибка при удалении статьи');
    });
});

// меню прототип

app.get('/add-menu', determineTime, (req, res) => {
  const { email, userLoggedIn } = req.session;
  User.findOne({ email })
    .then((user) => {
      if (userLoggedIn && user.role === 'admin') {
        res.render(createPath('add-menu'), {
          userLoggedIn,
          user,
          currentUrl: req.url,
          isOpen: res.locals.isOpen,
        });
      } else {
        // Если пользователь не администратор или не вошел в систему, выполните соответствующие действия
        res.status(403).send('Access Forbidden');
      }
    })
    .catch((err) => {
      // Обработка ошибок запроса к базе данных
      console.error('Error finding user:', err);
      res.status(500).send('Internal Server Error');
    });
});

// если пользователь хочет выйти

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

// api - login, register

app.post('/api/change-password', async (req, res) => {
  const { token, newpassword: plainTextPassword } = req.body

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' })
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)

    const _id = user.id

    const password = await bcrypt.hash(plainTextPassword, 10)

    await User.updateOne(
      { _id },
      {
        $set: { password }
      }
    )
    res.json({ status: 'ok' })
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: ';))' })
  }

})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid email' })
  }

  if (await bcrypt.compare(password, user.password)) {
    // успешная аутентификацияВ
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
    req.session.email = email;

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
    req.session.email = email;

    res.json({ status: 'ok', userLoggedIn: true });
  } catch (error) {
    console.error('Error:', error);
    res.json({ status: 'error', error: 'Something went wrong' });
  }
});

// посты в блоге
app.post('/add-post', upload.single('post_image'), (req, res) => {
  const { title, author, text } = req.body;

  if (req.file) {
    const post_image = `/uploads/${req.file.originalname}`;
    const post = new Post({ title, author, text, post_image });
    post.save()
      .then(result => {
        res.send(result);
      })
      .catch(error => {
        console.error(error);
        res.render(createPath('error'), { title: 'Error' });
      });
  } else {
    // Обработка случая, когда файл не был загружен
    res.status(400).send('No file uploaded');
  }
});

// Обработчик POST-запроса для добавления нового меню с изображением
app.post('/add-menu', upload.single('image'), [
  check('price').isNumeric().withMessage('Price must be numeric'),
  check('title').matches(/[А-Яа-яЁё]/).withMessage('Title must contain at least one Cyrillic letter')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { title, ingredients, price, menu__id } = req.body;

  // Добавляем пробелы в числовое значение цены
  price = formatNumberWithSpaces(price);

  // Проверяем, есть ли файл в запросе
  if (req.file) {
    const image = `/uploads/${req.file.originalname}`;
    const menu = new Menu({ title, ingredients, price, image, menu__id });

    menu.save()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  } else {
    // Обработка случая, когда файл не был загружен
    res.status(400).send('No file uploaded');
  }
});

app.post("/change-user-info", upload.single('avatar'), (req, res) => {
  const { first_name, last_name, email } = req.body;

  // Проверяем, был ли загружен файл
  if (req.file) {
    const avatar = `/uploads/${req.file.originalname}`;

    // Обновляем данные пользователя в базе данных
    User.findOneAndUpdate({ email: email }, { first_name, last_name, avatar }, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send('User not found');
        }
        res.send(updatedUser);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  } else {
    // Если файл не был загружен, обновляем только данные пользователя, без аватара
    User.findOneAndUpdate({ email: email }, { first_name, last_name }, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          // Если пользователь не найден, возвращаем ошибку
          return res.status(404).send('User not found');
        }
        // Если данные пользователя успешно обновлены, отправляем обновленные данные клиенту
        res.send(updatedUser);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  }
});

// Errors

// Обработчик ошибки 404 (Страница не найдена)
app.use((req, res, next) => {
  const errorCode = 404;
  const errorMessage = 'Page Not Found';
  res.status(404).render(createPath('error'), { errorCode, errorMessage });
});

app.listen(3000, () => {
  console.log(`App listening at http://localhost:${port}`);
})