import { page, render, html } from './lib/bible.js';

import { navigationPage } from './Middlewares/navigationMiddleware.js';
import { homePage } from './src/home.js';
import { createPage } from './src/create.js';
import { dashboardPage } from './src/dashboard.js';
import { deletePage } from './src/delete.js';
import { detailsPage } from './src/details.js';
import { editPage } from './src/edit.js';
import { logoutPage } from './src/logout.js';
import { loginPage } from './src/login.js';
import { registerPage } from './src/register.js';

page(navigationPage);

page('/', homePage);
page('/create', createPage);
page('/dashboard', dashboardPage);
page('/dashboard/delete/:id', deletePage);
page('/dashboard/:id', detailsPage);
page('/dashboard/edit/:id', editPage);
page('/logout', logoutPage);
page('/login', loginPage);
page('/register', registerPage);

page();