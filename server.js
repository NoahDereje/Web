const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const data = require("./data")
const port = 4131;

function myAuthorizer(username, password) {
  if (username === 'admin') {
    if (password === 'password') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
  
const authOptions = {
  authorizer: myAuthorizer,
  challenge: true,
  unauthorizedResponse: getUnauthorizedResponse,
};

const basicAuthMiddleware = basicAuth(authOptions);

function getUnauthorizedResponse(req) {
  if (req.auth) {
    return 'Credentials rejected';
  } else {
    return 'No credentials provided.';
  }
}

app.use('/admin', basicAuthMiddleware, (req, res, next) => {
  if (!req.auth.user) {
    res.redirect('/forbidden');
  } else {
    if (!req.auth.password) {
      res.redirect('/forbidden');
    } else {
      next();
    }
  }
});


app.get('/forbidden', (req, res) => {
  res.status(403).send('Access Forbidden');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static((__dirname, 'resources')));


app.set('view engine', 'pug');
app.set('views', './templates');

app.get('/', (req, res) => {
  res.render('mainpage');
});

app.get('/main', (req, res) => {
  res.render('mainpage');
});

app.get('/contact', (req, res) => {
  res.render('contactform');
});

app.post('/contact', async (req, res) => {
  const { name, email, date, dropdown, checkbox = 'off' } = req.body;
  const isContactValid = name && email && date && dropdown;
  if (isContactValid) {
    await data.addContact(name, email, date, dropdown, checkbox);
    res.render('confirmation');
  } else {
    res.status(400).render('denial');
  }
});

app.get('/testimonies', (req, res) => {
  res.render('testimonies');
});

app.get('/admin/contactlog', basicAuthMiddleware, async (req, res) => {
  const contacts = await data.getContacts();
  res.render('contactlog', { contacts });
});

app.delete('/api/contact', basicAuthMiddleware, async (req, res) => {
  const {Id} = req.body;
  if (!(await data.deleteContact(Id))) {
    res.status(404).send('Contact not found');
  } else {
    res.status(200).send('Contact deleted successfully');
  }
});

app.get('/api/sale', async (req, res) => {
const sales = await data.getRecentSales();
let response = {};

if (sales.length === 0 || sales[0].end_sale !== null) {
    response.active = false;
} else {
    response.active = true;
    response.message = sales[0].sale_message;
}

res.json(response);
});

app.post('/api/sale', basicAuthMiddleware, async (req, res) => {
await data.addSale(req.body.message);
res.send('Sale posted');
});

app.delete('/api/sale', basicAuthMiddleware, async (req, res) => {
const salesEnded = await data.endSales();
if (salesEnded) {
    res.send('Sale ended');
} else {
    res.status(500).send('Failed to end sale');
}
});

app.get('/admin/salelog', basicAuthMiddleware, async (req, res) => {
const sales = await data.getRecentSales();
const formattedSales = sales.map(sale => {
    let activeStatus;
    if (sale.end_sale === null) {
        activeStatus = 1;
    } else {
        activeStatus = 0;
    }
    return {
        message: sale.sale_message,
        active: activeStatus
    };
});
res.json(formattedSales);
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;

