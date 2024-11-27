import { page } from './lib/bible.js';


import { createPage } from './JS/create.js';
import { dashboardPage } from './JS/dashboard.js';
import { deletePage } from './JS/delete.js';
import { detailsPage } from './JS/details.js';
import { editPage } from './JS/edit.js';
import { loginPage } from './JS/login.js';
import { logoutPage } from './JS/logout.js';
import { registerPage } from './JS/register.js';
import { homePage } from './JS/home.js';
import { renderNavigation } from './middlewares/navigationMiddleware.js';

page(renderNavigation);
page('/', homePage);
page('/create', createPage);
page('/market', dashboardPage);
page('/delete', deletePage);
page('/market/:id', detailsPage);
page('/market/edit/:id', editPage);
page('/login', loginPage);
page('/register', registerPage);
page('/market/delete/:id', deletePage);
page('/logout', logoutPage);

page.start();

