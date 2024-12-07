const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const host = "http://localhost:3000"; // Application host (NOT service host - that can be anything)
const interval = 300;
const timeout = 6000;
const DEBUG = false;
const slowMo = 500;

const mockData = {
    "users": [
        {
            "_id": "0001",
            "email": "john@abv.bg",
            "password": "123456",
            "accessToken": "AAAA"
        },
        {
            "_id": "0002",
            "email": "ivan@abv.bg",
            "password": "pass123",
            "accessToken": "BBBB"
        },
        {
            "_id": "0003",
            "email": "peter@abv.bg",
            "password": "123456",
            "accessToken": "CCCC"
        }
    ],

    "catalog": [
        {
          "_id": "1003",
          "_ownerId": "0002",
          "model": 'Pagani Huayra',
          "imageUrl": '/images/pagani.jpg',
          "price": '1,010,310',
          "weight": '1350' ,
          "speed": '360' ,
          "about": 'The Pagani Huayra is a breathtaking hypercar that seamlessly blends art and engineering, representing the epitome of automotive craftsmanship. Its striking exterior features aerodynamic curves and gull-wing doors, showcasing a design that\'s both futuristic and elegant. Underneath the hood, a meticulously crafted AMG-sourced V12 engine delivers an exhilarating performance, propelling the Huayra to astounding speeds, while the opulent interior envelops the driver in a cocoon of luxury, making every journey a symphony of power and refinement.' ,
        },
        {
          "_id": "1002",
          "_ownerId": "0002",
          "model": 'Aston Martin One-77',
          "imageUrl": '/images/martin.png',
          "price": '2,960,000',
          "weight": '1500' ,
          "speed": '355' ,
          "about": 'The Aston Martin One-77 is a rare and extraordinary masterpiece, limited to just 77 units worldwide, making it a coveted gem among automotive enthusiasts. Its sleek and aerodynamic design is a testament to British craftsmanship, featuring a handcrafted aluminum body that exudes both power and sophistication. Beneath its hood lies a potent 7.3-liter V12 engine, delivering an exhilarating blend of speed and precision, while the meticulously crafted interior combines luxurious materials and cutting-edge technology to create a driving experience that is truly unparalleled.' ,
        },
        {
          "_id": "1001",
          "_ownerId": "0001",
          "model": 'Ferrari LaFerrari',
          "imageUrl": '/images/ferrari.png',
          "price": '3,210,000',
          "weight": '1600' ,
          "speed": '355' ,
          "about": 'The Ferrari LaFerrari stands as a pinnacle of automotive excellence, seamlessly blending stunning Italian design with cutting-edge hybrid technology. Its sculpted and aerodynamic exterior houses a potent hybrid powertrain, combining a V12 engine with an electric motor to produce an awe-inspiring performance. With a limited production run, the LaFerrari is not only a technological marvel but also a rare and coveted symbol of Ferrari\'s relentless pursuit of automotive perfection.' ,
        }
      ]
   
};
const endpoints = {
    register: "/users/register",
    login: "/users/login",
    logout: "/users/logout",
    catalog: "/data/cars?sortBy=_createdOn%20desc",
    create: "/data/cars",
    search: (query) => `/data/cars?where=model%20LIKE%20%22${query}%22`,
    details: (id) => `/data/cars/${id}`,
    delete: (id) => `/data/cars/${id}`,
    own: (motorcycleId, userId) => `/data/cars?where=_id%3D%22${motorcycleId}%22%20and%20_ownerId%3D%22${userId}%22&count`,

};

let browser;
let context;
let page;

describe("E2E tests", function () {
    // Setup
    this.timeout(DEBUG ? 120000 : timeout);
    before(async () => {
        browser = await chromium.launch(DEBUG ? { headless: false, slowMo } : {});
    });
    after(async () => {
        await browser.close();

    });
    beforeEach(async function () {
        this.timeout(10000);
        context = await browser.newContext();
        setupContext(context);
        page = await context.newPage();
    });
    afterEach(async () => {
        await page.close();
        await context.close();
    });

    // Test proper
    describe("Authentication [ 20 Points ]", function () {
        it("Login does NOT work with empty fields [ 2.5 Points ]", async function () {
            const { post } = await handle(endpoints.login);
            const isCalled = post().isHandled;

            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            await page.waitForSelector("form", { timeout: interval });
            await page.click('[type="submit"]');

            await page.waitForTimeout(interval);
            expect(isCalled()).to.equal(false, 'Login API was called when form inputs were empty');
        });

        it("Login with valid input makes correct API call [ 2.5 Points ]", async function () {
            const data = mockData.users[0];
            const { post } = await handle(endpoints.login);
            const { onRequest } = post(data);

            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            //Can check using Ids if they are part of the provided HTML
            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);

            const [request] = await Promise.all([
                onRequest(),
                page.click('[type="submit"]'),
            ]);

            const postData = JSON.parse(request.postData());
            expect(postData.email).to.equal(data.email);
            expect(postData.password).to.equal(data.password);
        });

        it("Login shows alert on fail and does not redirect [ 2.5 Points ]", async function () {
            const data = mockData.users[0];
            const { post } = await handle(endpoints.login);
            let options = { json: true, status: 400 };
            const { onResponse } = post({ message: 'Error 400' }, options);

            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            await page.waitForSelector('form', { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);

            //check for alert from failed login
            let alertPromise = new Promise(resolve => {
                page.on('dialog', async dialog => {
                    await dialog.accept();
                    resolve(dialog.type());
                });
            })

            await Promise.all([
                onResponse(),
                page.click('[type="submit"]')
            ]);

            //should still be on login page, can check using ids if they are part of the provided HTML
            await page.waitForSelector('form', { timeout: interval });
            let dialogType = await alertPromise;
            expect(dialogType).to.equal('alert');
        });

        it("Register does NOT work with empty fields [ 2.5 Points ]", async function () {
            const { post } = await handle(endpoints.register);
            const isCalled = post().isHandled;

            await page.goto(host);

            let registerBtn = await page.waitForSelector('text=Register', { timeout: interval });
            await registerBtn.click();

            await page.waitForSelector("form", { timeout: interval });
            await page.click('[type="submit"]');

            await page.waitForTimeout(interval);
            expect(isCalled()).to.be.false;
        });

        it("Register does NOT work with different passwords [ 2.5 Points ]", async function () {
            const data = mockData.users[1];
            const { post } = await handle(endpoints.register);
            const isCalled = post().isHandled;

            await page.goto(host);

            let registerBtn = await page.waitForSelector('text=Register', { timeout: interval });
            await registerBtn.click();

            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
            let repeatPasswordElement = await page.waitForSelector('[name="re-password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);
            await repeatPasswordElement.fill('nope');

            //check for alert from failed register
            let alertPromise = new Promise(resolve => {
                page.on('dialog', async dialog => {
                    await dialog.accept();
                    resolve(dialog.type());
                });
            })

            await page.click('[type="submit"]');

            //should still be on register page, can check using ids if they are part of the provided HTML
            await page.waitForSelector('form', { timeout: interval });
            let dialogType = await alertPromise;
            expect(dialogType).to.equal('alert');
            expect(isCalled()).to.equal(false, 'Register API was called when form inputs were empty');
        });

        it("Register with valid input makes correct API call [ 2.5 Points ]", async function () {
            const data = mockData.users[1];
            const { post } = await handle(endpoints.register);
            const { onRequest } = post(data);

            await page.goto(host);

            let registerBtn = await page.waitForSelector('text=Register', { timeout: interval });
            await registerBtn.click();

            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
            let repeatPasswordElement = await page.waitForSelector('[name="re-password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);
            await repeatPasswordElement.fill(data.password);

            const [request] = await Promise.all([
                onRequest(),
                page.click('[type="submit"]'),
            ]);

            const postData = JSON.parse(request.postData());
            expect(postData.email).to.equal(data.email);
            expect(postData.password).to.equal(data.password);
        });

        it("Register shows alert on fail and does not redirect [ 2.5 Points ]", async function () {
            const data = mockData.users[1];
            const { post } = await handle(endpoints.register);
            let options = { json: true, status: 400 };
            const { onResponse } = post({ message: 'Error 409' }, options);

            await page.goto(host);

            let registerBtn = await page.waitForSelector('text=Register', { timeout: interval });
            await registerBtn.click();

            await page.waitForSelector('form', { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
            let repeatPasswordElement = await page.waitForSelector('[name="re-password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);
            await repeatPasswordElement.fill(data.password);

            //check for alert from failed register
            let alertPromise = new Promise(resolve => {
                page.on('dialog', async dialog => {
                    await dialog.accept();
                    resolve(dialog.type());
                });
            })

            await Promise.all([
                onResponse(),
                page.click('[type="submit"]')
            ]);

            //should still be on register page, can check using ids if they are part of the provided HTML
            await page.waitForSelector('form', { timeout: interval });
            let dialogType = await alertPromise;
            expect(dialogType).to.equal('alert');
        });

        it("Logout makes correct API call [ 2.5 Points ]", async function () {
            const data = mockData.users[2];
            const { post } = await handle(endpoints.login);
            const { get } = await handle(endpoints.logout);
            const { onResponse } = post(data);
            const { onRequest } = get("", { json: false, status: 204 });

            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            //Can check using Ids if they are part of the provided HTML
            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });

            await emailElement.fill(data.email);
            await passwordElement.fill(data.password);

            await Promise.all([onResponse(), page.click('[type="submit"]')]);

            let logoutBtn = await page.waitForSelector('nav >> text=Logout', { timeout: interval });

            const [request] = await Promise.all([
                onRequest(),
                logoutBtn.click()
            ]);

            const token = request.headers()["x-authorization"];
            expect(request.method()).to.equal("GET");
            expect(token).to.equal(data.accessToken);
        });
    });

    describe("Navigation bar [ 10 Points ]", () => {
        it("Logged user should see correct navigation [ 2.5 Points ]", async function () {
            // Login user
            const userData = mockData.users[0];
            const { post: loginPost } = await handle(endpoints.login);
            loginPost(userData);
            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });

            await emailElement.fill(userData.email);
            await passwordElement.fill(userData.password);

            await page.click('[type="submit"]');

            //Test for navigation
            await page.waitForSelector('nav >> text= Our Cars', { timeout: interval });

            expect(await page.isVisible("nav >> text=Our Cars")).to.be.true;
            expect(await page.isVisible("nav >> text=Add Your Car")).to.be.true;
            expect(await page.isVisible("nav >> text=Logout")).to.be.true;
            expect(await page.isVisible("nav >> text=Search")).to.be.true;


            expect(await page.isVisible("nav >> text=Login")).to.be.false;
            expect(await page.isVisible("nav >> text=Register")).to.be.false;
        });

        it("Guest user should see correct navigation [ 2.5 Points ]", async function () {
            await page.goto(host);

            await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });

            expect(await page.isVisible("nav"), "Dashboard is not visible").to.be.true;
            expect(await page.isVisible("nav >> text=Add Your Car"), "Create is visible").to.be.false;
            expect(await page.isVisible("nav >> text=Logout"), "Logout is visible").to.be.false;
            expect(await page.isVisible("nav >> text=Login"), "Login is not visible").to.be.true;
            expect(await page.isVisible("nav >> text=Register"), "Ragister is not visible").to.be.true;
        });

        it("Guest user navigation should work [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog);
            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector('#dashboard', { timeout: interval });
            let loginBtn = await page.waitForSelector('nav >> text=Login', { timeout: interval });
            await loginBtn.click();


            await page.waitForSelector('#login', { timeout: interval });
            let registerBtn = await page.waitForSelector('nav >> text=Register', { timeout: interval });
            await registerBtn.click();

            await page.waitForSelector('#register', { timeout: interval });
            let logo = await page.waitForSelector('#logo', { timeout: interval });
            await logo.click();

            await page.waitForSelector('#hero', { timeout: interval });
        });

        it("Logged in user navigation should work [ 2.5 Points ]", async function () {
            // Login user
            const userData = mockData.users[0];
            const { post: loginPost } = await handle(endpoints.login);
            loginPost(userData);
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog);

            await page.goto(host);

            let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
            await loginBtn.click();

            await page.waitForSelector("form", { timeout: interval });

            let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
            let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });

            await emailElement.fill(userData.email);
            await passwordElement.fill(userData.password);

            await page.click('[type="submit"]');

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector('#dashboard', { timeout: interval });
            let createBtn = await page.waitForSelector('nav >> text=Add Your Car', { timeout: interval });
            await createBtn.click();

            await page.waitForSelector('#create', { timeout: interval });
            let logo = await page.waitForSelector('#logo', { timeout: interval });
            await logo.click();

            await page.waitForSelector('#hero', { timeout: interval });
        });
    });

    describe("Home Page [ 5 Points ]", function () {
        it("Show Home page text [ 2.5 Points ]", async function () {
            await page.goto(host);
            await page.waitForSelector('text=Accelerate Your Passion Unleash The Thrill Of Sport Cars Together!', { timeout: interval });
            expect(await page.isVisible("text=Accelerate Your Passion Unleash The Thrill Of Sport Cars Together!")).to.be.true;
        });

        it("Show home page image [ 2.5 Points ]", async function () {
            await page.goto(host);
            await page.waitForSelector('a img', { timeout: interval });
            expect(await page.isVisible('a img')).to.be.true;
        });
    });

    describe("Dashboard Page [ 15 Points ]", function () {
        it("Show Our Cars page - welcome message [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get([]);
            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text= Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector('h3 >> text=Our Cars', { timeout: interval });
            expect(await page.isVisible("h3 >> text=Our Cars")).to.be.true;
        });

        it("Check Our Cars page with 0 Motorcycles [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get([]);

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector('text=Nothing to see yet', { timeout: interval });
            expect(await page.isVisible('text=Nothing to see yet')).to.be.true;

        });

        it("Check Cars have correct images [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog);
            const data = mockData.catalog;

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector(".car img", { timeout: interval });
            const images = await page.$$eval(".car img", (t) =>
                t.map((s) => s.src)
            );

            expect(images.length).to.equal(3);
            expect(images[0]).to.contains(`${encodeURI(data[0].imageUrl)}`);
            expect(images[1]).to.contains(`${encodeURI(data[1].imageUrl)}`);
            expect(images[2]).to.contains(`${encodeURI(data[2].imageUrl)}`);
        });

        it("Check Cars have correct model [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog);
            const data = mockData.catalog;

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector(".car .model", { timeout: interval });
            const categories = await page.$$eval(".car .model", (t) =>
                t.map((s) => s.textContent)
            );

            expect(categories.length).to.equal(3);
            expect(categories[0]).to.contains(`${data[0].model}`);
            expect(categories[1]).to.contains(`${data[1].model}`);
            expect(categories[2]).to.contains(`${data[2].model}`);
        });

        it("Check Cars have correct price [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog.slice(0, 2));
            const data = mockData.catalog.slice(0, 2);

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector(".specs .price", { timeout: interval });
            const categories = await page.$$eval(".specs .price", (t) =>
                t.map((s) => s.textContent)
            );

            expect(categories.length).to.equal(2);
            expect(categories[0]).to.contains(`${data[0].price}`);
            expect(categories[1]).to.contains(`${data[1].price}`);
        });
        it("Check Cars have correct weigth [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog.slice(0, 2));
            const data = mockData.catalog.slice(0, 2);

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector(".specs .weight", { timeout: interval });
            const categories = await page.$$eval(".specs .weight", (t) =>
                t.map((s) => s.textContent)
            );

            expect(categories.length).to.equal(2);
            expect(categories[0]).to.contains(`${data[0].weight}`);
            expect(categories[1]).to.contains(`${data[1].weight}`);
        });
        it("Check Cars have correct top-speed [ 2.5 Points ]", async function () {
            const { get } = await handle(endpoints.catalog);
            get(mockData.catalog.slice(0, 2));
            const data = mockData.catalog.slice(0, 2);

            await page.goto(host);

            let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
            await funFactsBtn.click();

            await page.waitForSelector(".specs .top-speed", { timeout: interval });
            const categories = await page.$$eval(".specs .top-speed", (t) =>
                t.map((s) => s.textContent)
            );

            expect(categories.length).to.equal(2);
            expect(categories[0]).to.contains(`${data[0].speed}`);
            expect(categories[1]).to.contains(`${data[1].speed}`);
        });
       
    });

    describe("CRUD [ 50 Points ]", () => {
        describe('Create [ 12.5 Points ]', function () {
            it("Create does NOT work with empty fields [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post: loginPost } = await handle(endpoints.login);
                loginPost(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                await page.click('[type="submit"]');

                const { post } = await handle(endpoints.create);
                const isCalled = post().isHandled;

                let addFactButton = await page.waitForSelector('text=Add Your Car', { timeout: interval });
                await addFactButton.click();

                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await submitBtn.click();

                await page.waitForTimeout(interval);
                expect(isCalled()).to.equal(false, 'Create API was called when form inputs were empty');
            });

            it("Create makes correct API call [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post: loginPost } = await handle(endpoints.login);
                loginPost(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const data = mockData.catalog[0];
                const { post } = await handle(endpoints.create);
                const { onRequest } = post(data);

                let addFactButton = await page.waitForSelector('text=Add Your Car', { timeout: interval });
                await addFactButton.click();

                let modelElement = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageElement = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let priceElement = await page.waitForSelector('[name="price"]', { timeout: interval });
                let weightElement = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let speedElement = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutElement = await page.waitForSelector('[name="about"]', { timeout: interval });
                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await modelElement.fill(data.model);
                await imageElement.fill(data.imageUrl);
                await priceElement.fill(data.price);
                await weightElement.fill(data.weight);
                await speedElement.fill(data.speed);
                await aboutElement.fill(data.about);


                const [request] = await Promise.all([
                    onRequest(),
                    submitBtn.click(),
                ]);
            });

            it("Create sends correct data [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post: loginPost } = await handle(endpoints.login);
                loginPost(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const data = mockData.catalog[0];
                const { post } = await handle(endpoints.create);
                const { onRequest } = post(data);

                let addFactButton = await page.waitForSelector('text=Add Your Car', { timeout: interval });
                await addFactButton.click();

          
                let modelElement = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageElement = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let priceElement = await page.waitForSelector('[name="price"]', { timeout: interval });
                let weightElement = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let speedElement = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutElement = await page.waitForSelector('[name="about"]', { timeout: interval });
                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await modelElement.fill(data.model);
                await imageElement.fill(data.imageUrl);
                await priceElement.fill(data.price);
                await weightElement.fill(data.weight);
                await speedElement.fill(data.speed);
                await aboutElement.fill(data.about);

                const [request] = await Promise.all([
                    onRequest(),
                    submitBtn.click(),
                ]);

                const postData = JSON.parse(request.postData());

                expect(postData.model).to.equal(data.model);
                expect(postData.imageUrl).to.equal(data.imageUrl);
                expect(postData.price).to.equal(data.price);
                expect(postData.weight).to.equal(data.weight);
                expect(postData.speed).to.equal(data.speed);
                expect(postData.about).to.equal(data.about);


            });

            it("Create includes correct headers [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post: loginPost } = await handle(endpoints.login);
                loginPost(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const data = mockData.catalog[0];
                const { post } = await handle(endpoints.create);
                const { onRequest } = post(data);

                let addFactButton = await page.waitForSelector('text=Add Your Car', { timeout: interval });
                await addFactButton.click();

                let modelElement = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageElement = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let priceElement = await page.waitForSelector('[name="price"]', { timeout: interval });
                let weightElement = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let speedElement = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutElement = await page.waitForSelector('[name="about"]', { timeout: interval });
                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await modelElement.fill(data.model);
                await imageElement.fill(data.imageUrl);
                await priceElement.fill(data.price);
                await weightElement.fill(data.weight);
                await speedElement.fill(data.speed);
                await aboutElement.fill(data.about);

                const [request] = await Promise.all([
                    onRequest(),
                    submitBtn.click(),
                ]);

                const token = request.headers()["x-authorization"];
                expect(token).to.equal(userData.accessToken, 'Request did not send correct authorization header');
            });

            it("Create redirects to dashboard on success [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post: loginPost } = await handle(endpoints.login);
                loginPost(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const data = mockData.catalog[0];
                const { post } = await handle(endpoints.create);
                const { onResponse } = post(data);

                let addFactButton = await page.waitForSelector('text=Add Your Car', { timeout: interval });
                await addFactButton.click();

                let modelElement = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageElement = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let priceElement = await page.waitForSelector('[name="price"]', { timeout: interval });
                let weightElement = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let speedElement = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutElement = await page.waitForSelector('[name="about"]', { timeout: interval });
                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await modelElement.fill(data.model);
                await imageElement.fill(data.imageUrl);
                await priceElement.fill(data.price);
                await weightElement.fill(data.weight);
                await speedElement.fill(data.speed);
                await aboutElement.fill(data.about);

                await Promise.all([
                    onResponse(),
                    submitBtn.click(),
                ]);

                await page.waitForSelector('#dashboard', {timeout: interval});
            });
        })

        describe('Details [ 10 Points ]', function () {
            it("Details calls the correct API [ 2.5 Points ]", async function () {
                await page.goto(host);

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[1];
                const { get } = await handle(endpoints.details(data._id));
                let { onResponse, isHandled } = get(data);


                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });

                await Promise.all([
                    onResponse(),
                    moreInfoButton.click()
                ]);

                expect(isHandled()).to.equal(true, 'Details API did not receive a correct call');
            });

            it("Details with guest calls shows correct info [ 2.5 Points ]", async function () {
                await page.goto(host);

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[1];
                const { get } = await handle(endpoints.details(data._id));
                let { isHandled } = get(data);


                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let imageElement = await page.waitForSelector('#details-img', { timeout: interval });
                let modelElement = await page.waitForSelector('#details-title', { timeout: interval });
                let priceElement = await page.waitForSelector('.price', { timeout: interval });
                let weightElement = await page.waitForSelector('.weight', { timeout: interval });
                let speedElement = await page.waitForSelector('.top-speed', { timeout: interval });
                let aboutElement = await page.waitForSelector('#car-description', { timeout: interval });



                let imageSrc = await imageElement.getAttribute('src');
                let model = await modelElement.textContent();
                let price = await priceElement.textContent();
                let weight = await weightElement.textContent();
                let speed = await speedElement.textContent();
                let about = await aboutElement.textContent();


                expect(imageSrc).to.contains(data.imageUrl);
                expect(model).to.contains(data.model);
                expect(price).to.contains(data.price);
                expect(weight).to.contains(data.weight);
                expect(speed).to.contains(data.speed);
                expect(about).to.contains(data.about);
                expect(await page.isVisible('#action-buttons >> text="Delete"')).to.equal(false, 'Delete button was visible for non owner');
                expect(await page.isVisible('#action-buttons >> text="Edit"')).to.equal(false, 'Edit button was visible for non-owner');

                expect(isHandled()).to.equal(true, 'Details API was not called');
            });

            it("Details with logged in user shows correct info [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[0];
                const { get } = await handle(endpoints.details(data._id));
                let { isHandled } = get(data);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let imageElement = await page.waitForSelector('#details-img', { timeout: interval });
                let modelElement = await page.waitForSelector('#details-title', { timeout: interval });
                let priceElement = await page.waitForSelector('.price', { timeout: interval });
                let weightElement = await page.waitForSelector('.weight', { timeout: interval });
                let speedElement = await page.waitForSelector('.top-speed', { timeout: interval });
                let aboutElement = await page.waitForSelector('#car-description', { timeout: interval });



                let imageSrc = await imageElement.getAttribute('src');
                let model = await modelElement.textContent();
                let price = await priceElement.textContent();
                let weight = await weightElement.textContent();
                let speed = await speedElement.textContent();
                let about = await aboutElement.textContent();


                expect(imageSrc).to.contains(data.imageUrl);
                expect(model).to.contains(data.model);
                expect(price).to.contains(data.price);
                expect(weight).to.contains(data.weight);
                expect(speed).to.contains(data.speed);
                expect(about).to.contains(data.about);
                expect(await page.isVisible('#action-buttons >> text="Delete"')).to.equal(false, 'Delete button was visible for non owner');
                expect(await page.isVisible('#action-buttons >> text="Edit"')).to.equal(false, 'Edit button was visible for non-owner');

                expect(isHandled()).to.equal(true, 'Details API was not called');
            });

            it("Details with owner shows correct info [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[1];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[0];
                const { get } = await handle(endpoints.details(data._id));
                let { isHandled } = get(data);


                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let imageElement = await page.waitForSelector('#details-img', { timeout: interval });
                let modelElement = await page.waitForSelector('#details-title', { timeout: interval });
                let priceElement = await page.waitForSelector('.price', { timeout: interval });
                let weightElement = await page.waitForSelector('.weight', { timeout: interval });
                let speedElement = await page.waitForSelector('.top-speed', { timeout: interval });
                let aboutElement = await page.waitForSelector('#car-description', { timeout: interval });



                let imageSrc = await imageElement.getAttribute('src');
                let model = await modelElement.textContent();
                let price = await priceElement.textContent();
                let weight = await weightElement.textContent();
                let speed = await speedElement.textContent();
                let about = await aboutElement.textContent();


                expect(imageSrc).to.contains(data.imageUrl);
                expect(model).to.contains(data.model);
                expect(price).to.contains(data.price);
                expect(weight).to.contains(data.weight);
                expect(speed).to.contains(data.speed);
                expect(about).to.contains(data.about);
                expect(await page.isVisible('#action-buttons >> text="Delete"')).to.equal(true, 'Delete button was NOT visible for owner');
                expect(await page.isVisible('#action-buttons >> text="Edit"')).to.equal(true, 'Edit button was NOT visible for owner');

                expect(isHandled()).to.equal(true, 'Details API was not called');
            });
        })

        describe('Edit [ 17.5 Points ]', function () {
            it("Edit calls correct API to populate info [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[1];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[1];
                const { get } = await handle(endpoints.details(data._id));
                let { onResponse, isHandled } = get(data);


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });

                await Promise.all([
                    onResponse(),
                    editButton.click()
                ]);

                expect(isHandled()).to.equal(true, 'Request was not sent to Details API to get Edit information');
            });

            it("Edit should populate form with correct data [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[1];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[1];
                const { get } = await handle(endpoints.details(data._id));
                get(data);

                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

                await page.waitForSelector('.form .edit-form input', { timeout: interval });
                await page.waitForSelector('.edit-form textarea', { timeout: interval });

                const inputs = await page.$$eval(".form .edit-form input", (t) => t.map((i) => i.value));
                const textareas = await page.$$eval(".edit-form textarea", (t) => t.map((i) => i.value));

                expect(inputs[0]).to.contains(data.model);
                expect(inputs[1]).to.contains(data.imageUrl);
                expect(inputs[2]).to.contains(data.price);
                expect(inputs[3]).to.contains(data.weight);
                expect(inputs[4]).to.contains(data.speed);
                expect(textareas[0]).to.contains(data.about);
            });

            it("Edit does NOT work with empty fields [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[2];
                const { get, put } = await handle(endpoints.details(data._id));
                get(data);
                const { isHandled } = put();


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

                let modelInput = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageInput = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let yearInput = await page.waitForSelector('[name="price"]', { timeout: interval });
                let mileageInput = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let contactInput = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutInput = await page.waitForSelector('[name="about"]', { timeout: interval });

                await modelInput.fill('');
                await imageInput.fill('');
                await yearInput.fill('');
                await mileageInput.fill('');
                await contactInput.fill('');
                await aboutInput.fill('');


                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await submitBtn.click();

                await page.waitForTimeout(interval);
                expect(isHandled()).to.equal(false, 'Edit API was called when form inputs were empty');
            });

            it("Edit sends information to the right API [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);

                const data = mockData.catalog[2];
                const modifiedData = Object.assign({}, data);
                modifiedData.model = 'Model Test';
                modifiedData.imageUrl = 'Image Test';
                modifiedData.year = '1';
                modifiedData.mileage = '1';
                modifiedData.contact = '1';
                modifiedData.about = 'About Test';


                const { get, put } = await handle(endpoints.details(data._id));
                get(data);
                const { isHandled, onResponse } = put(modifiedData);

                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

                let modelInput = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageInput = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let yearInput = await page.waitForSelector('[name="price"]', { timeout: interval });
                let mileageInput = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let contactInput = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutInput = await page.waitForSelector('[name="about"]', { timeout: interval });

                await modelInput.fill(modifiedData.model);
                await imageInput.fill(modifiedData.imageUrl);
                await yearInput.fill(modifiedData.year);
                await mileageInput.fill(modifiedData.mileage);
                await contactInput.fill(modifiedData.contact);
                await aboutInput.fill(modifiedData.about);

                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await Promise.all([
                    onResponse(),
                    submitBtn.click(),
                ]);

                expect(isHandled()).to.equal(true, 'The Edit API was not called');
            });

            it("Edit sends correct headers [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const data = mockData.catalog[2];
                const modifiedData = Object.assign({}, data);
                modifiedData.model = 'Model Test';
                modifiedData.imageUrl = 'Image Test';
                modifiedData.price = '1';
                modifiedData.weight = '1';
                modifiedData.speed = '1';
                modifiedData.about = 'About Test';

                const { get, put } = await handle(endpoints.details(data._id));
                get(data);
                const { onRequest } = put(modifiedData);


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

               
                let modelInput = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageInput = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let yearInput = await page.waitForSelector('[name="price"]', { timeout: interval });
                let mileageInput = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let contactInput = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutInput = await page.waitForSelector('[name="about"]', { timeout: interval });

                await modelInput.fill(modifiedData.model);
                await imageInput.fill(modifiedData.imageUrl);
                await yearInput.fill(modifiedData.price);
                await mileageInput.fill(modifiedData.weight);
                await contactInput.fill(modifiedData.speed);
                await aboutInput.fill(modifiedData.about);


                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                let [request] = await Promise.all([
                    onRequest(),
                    submitBtn.click(),
                ]);

                const token = request.headers()["x-authorization"];
                expect(token).to.equal(userData.accessToken, 'Request did not send correct authorization header');
            });

            it("Edit sends correct information [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const data = mockData.catalog[2];
                const modifiedData = Object.assign({}, data);
            modifiedData.model = 'Model Test';
                modifiedData.imageUrl = 'Image Test';
                modifiedData.price = '1';
                modifiedData.weight = '1';
                modifiedData.speed = '1';
                modifiedData.about = 'About Test';

                const { get, put } = await handle(endpoints.details(data._id));
                get(data);
                const { onRequest } = put(modifiedData);


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

                let modelInput = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageInput = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let yearInput = await page.waitForSelector('[name="price"]', { timeout: interval });
                let mileageInput = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let contactInput = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutInput = await page.waitForSelector('[name="about"]', { timeout: interval });

                await modelInput.fill(modifiedData.model);
                await imageInput.fill(modifiedData.imageUrl);
                await yearInput.fill(modifiedData.price);
                await mileageInput.fill(modifiedData.weight);
                await contactInput.fill(modifiedData.speed);
                await aboutInput.fill(modifiedData.about);


                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                const [request] = await Promise.all([
                    onRequest(),
                    submitBtn.click(),
                ]);

                const postData = JSON.parse(request.postData());

                expect(postData.model).to.contains(modifiedData.model);
                expect(postData.imageUrl).to.contains(modifiedData.imageUrl);
                expect(postData.price).to.contains(modifiedData.price);
                expect(postData.weight).to.contains(modifiedData.weight);
                expect(postData.speed).to.contains(modifiedData.speed);
                expect(postData.about).to.contains(modifiedData.about);
            });

            it("Edit redirects to Details on success [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const data = mockData.catalog[2];
                const modifiedData = Object.assign({}, data);
            modifiedData.model = 'Model Test';
                modifiedData.imageUrl = 'Image Test';
                modifiedData.price = '1';
                modifiedData.weight = '1';
                modifiedData.speed = '1';
                modifiedData.about = 'About Test';

                const { get, put } = await handle(endpoints.details(data._id));
                get(data);
                const { onResponse } = put(modifiedData);


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let editButton = await page.waitForSelector('#action-buttons >> text="Edit"', { timeout: interval });
                await editButton.click();

              
                let modelInput = await page.waitForSelector('[name="model"]', { timeout: interval });
                let imageInput = await page.waitForSelector('[name="imageUrl"]', { timeout: interval });
                let yearInput = await page.waitForSelector('[name="price"]', { timeout: interval });
                let mileageInput = await page.waitForSelector('[name="weight"]', { timeout: interval });
                let contactInput = await page.waitForSelector('[name="speed"]', { timeout: interval });
                let aboutInput = await page.waitForSelector('[name="about"]', { timeout: interval });

                await modelInput.fill(modifiedData.model);
                await imageInput.fill(modifiedData.imageUrl);
                await yearInput.fill(modifiedData.price);
                await mileageInput.fill(modifiedData.weight);
                await contactInput.fill(modifiedData.speed);
                await aboutInput.fill(modifiedData.about);

                let submitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });

                await Promise.all([
                    onResponse(),
                    submitBtn.click(),
                ]);

                await page.waitForSelector('#details', {timeout: interval});
            });
        })

        describe('Delete [ 10 Points ]', function () {
            it("Delete makes correct API call [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();
                const data = mockData.catalog[2];

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const { get, del } = await handle(endpoints.details(data._id));
                get(data);
                const { onRequest, onResponse, isHandled } = del({ "_deletedOn": 1688586307461 });


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let deleteButton = await page.waitForSelector('#action-buttons >> text="Delete"', { timeout: interval });

                page.on('dialog', (dialog) => dialog.accept());

                let [request] = await Promise.all([onRequest(), onResponse(), deleteButton.click()]);

                const token = request.headers()["x-authorization"];
                expect(token).to.equal(userData.accessToken, 'Request did not send correct authorization header');
                expect(isHandled()).to.be.true;
            });

            it("Delete shows a confirm dialog [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();
                const data = mockData.catalog[2];

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const { get, del } = await handle(endpoints.details(data._id));
                get(data);
                const { onResponse, isHandled } = del({ "_deletedOn": 1688586307461 });


                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let deleteButton = await page.waitForSelector('#action-buttons >> text="Delete"', { timeout: interval });

                let alertPromise = new Promise(resolve => {
                    page.on('dialog', (dialog) => {
                        dialog.accept();
                        resolve(dialog.type());
                    });
                });

                let result = await Promise.all([alertPromise, onResponse(), deleteButton.click()]);
                expect(result[0]).to.equal('confirm');
            });

            it("Delete redirects to Dashboard on confirm accept [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();
                const data = mockData.catalog[2];

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const { get, del } = await handle(endpoints.details(data._id));
                get(data);
                const { onResponse, isHandled } = del({ "_deletedOn": 1688586307461 });

                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let deleteButton = await page.waitForSelector('#action-buttons >> text="Delete"', { timeout: interval });

                let alertPromise = new Promise(resolve => {
                    page.on('dialog', (dialog) => {
                        dialog.accept();
                        resolve(dialog.type());
                    });
                });

                await Promise.all([alertPromise, onResponse(), deleteButton.click()]);

                await page.waitForSelector('#dashboard', { timeout: interval });
            });

            it("Delete does not delete on confirm reject [ 2.5 Points ]", async function () {
                //Login
                const userData = mockData.users[0];
                const { post } = await handle(endpoints.login);
                post(userData);
                await page.goto(host);
                let loginBtn = await page.waitForSelector('text=Login', { timeout: interval });
                await loginBtn.click();
                await page.waitForSelector("form", { timeout: interval });
                let emailElement = await page.waitForSelector('[name="email"]', { timeout: interval });
                let passwordElement = await page.waitForSelector('[name="password"]', { timeout: interval });
                await emailElement.fill(userData.email);
                await passwordElement.fill(userData.password);
                let loginSubmitBtn = await page.waitForSelector('[type="submit"]', { timeout: interval });
                await loginSubmitBtn.click();
                const data = mockData.catalog[2];

                const { get: catalogGet } = await handle(endpoints.catalog);
                catalogGet(mockData.catalog);
                const { get, del } = await handle(endpoints.details(data._id));
                get(data);
                const { isHandled } = del({ "_deletedOn": 1688586307461 });

                const { get: own } = await handle(endpoints.own(data._id, userData._id));
                own(1);

                let funFactsBtn = await page.waitForSelector('nav >> text=Our Cars', { timeout: interval });
                await funFactsBtn.click();

                let moreInfoButton = await page.waitForSelector(`.car:has-text("${data.model}") >> .details-btn`, { timeout: interval });
                await moreInfoButton.click();

                let deleteButton = await page.waitForSelector('#action-buttons >> text="Delete"', { timeout: interval });

                let alertPromise = new Promise(resolve => {
                    page.on('dialog', (dialog) => {
                        dialog.dismiss();
                        resolve(dialog.type());
                    });
                });

                await Promise.all([alertPromise, deleteButton.click()]);
                expect(isHandled()).to.equal(false, 'Delete API was called when the confirm dialog not accepted');

                //Check if we're still on Details page
                await page.waitForSelector('#details', { timeout: interval });
            });
        })
    });

    describe('BONUS:Search Page [ 15 Points ]', async () => {

        it('Show no matches for Guest [ 2.5 Points ]', async () => {
            const { get } = await handle(endpoints.search('bbb'));
            get([]);
    
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'Tomato');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            expect(await page.isVisible('text=No result.')).to.be.true;
        });
    
        it('Show results with 2 cars for Guest [ 2.5 Points ]', async () => {
            const { get } = await handle(endpoints.search('h'));
            get(mockData.catalog.slice(0, 2));
            
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'h');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            const models = await page.$$eval(".car .model", (t) =>
            t.map((s) => s.textContent)
          );
    
          expect(models.length).to.equal(2);
            expect(models[0]).to.contains(`${mockData.catalog[0].model}`);
            expect(models[1]).to.contains(`${mockData.catalog[1].model}`);
        });
    
        it('Show More info button for Guest [ 2.5 Points ]', async () => {
            const { get } = await handle(endpoints.search('a'));
            get(mockData.catalog.slice(0, 1));
            
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'a');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            const names = await page.$$eval(".car .model", (t) =>
            t.map((s) => s.textContent));
    
            expect(names.length).to.equal(1);
            expect(names[0]).to.contains(`${mockData.catalog[0].model}`);
    
            expect(await page.isVisible('text="More Info"')).to.be.true;
        });
        
        it('Show no matches for Users [ 2.5 Points ]', async () => {
            // Login user
            const data = mockData.users[0];
            await page.goto(host);
            await page.waitForTimeout(interval);
            await page.click('text=Login');
            await page.waitForTimeout(interval);
            await page.waitForSelector('form');
    
            await page.fill('[name="email"]', data.email);
            await page.fill('[name="password"]', data.password);
    
            await page.click('[type="submit"]');
    
            const { get } = await handle(endpoints.search('bbb'));
            get([]);
    
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'bbb');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            expect(await page.isVisible('text=No result.')).to.be.true;
        });
    
        it('Show results with 2 cars for Users [ 2.5 Points ]', async () => {
            // Login user
            const data = mockData.users[0];
            await page.goto(host);
            await page.waitForTimeout(interval);
            await page.click('text=Login');
            await page.waitForTimeout(interval);
            await page.waitForSelector('form');
    
            await page.fill('[name="email"]', data.email);
            await page.fill('[name="password"]', data.password);
    
            await page.click('[type="submit"]');
    
            const { get } = await handle(endpoints.search('a'));
            get(mockData.catalog.slice(0, 2));
    
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'a');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            const names = await page.$$eval(".car .model", (t) =>
            t.map((s) => s.textContent));
    
            expect(names.length).to.equal(2);
            expect(names[0]).to.contains(`${mockData.catalog[0].model}`);
            expect(names[1]).to.contains(`${mockData.catalog[1].model}`);
    
      
        });
    
        it('More Info info button for User [ 2.5 Points ]', async () => {
            // Login user
            const data = mockData.users[0];
            await page.goto(host);
            await page.waitForTimeout(interval);
            await page.click('text=Login');
            await page.waitForTimeout(interval);
            await page.waitForSelector('form');
    
            await page.fill('[name="email"]', data.email);
            await page.fill('[name="password"]', data.password);
    
            await page.click('[type="submit"]');
    
            const { get } = await handle(endpoints.search('honda'));
            get(mockData.catalog.slice(0, 1));
    
            await page.goto(host);
            await page.waitForTimeout(interval);
    
            await page.click('nav >> text=Search');
            await page.waitForTimeout(interval);
    
            await page.fill('[name="search"]', 'honda');
            await page.click('button >> text="Search"');
            await page.waitForTimeout(interval);
    
            const names = await page.$$eval(".car .model", (t) =>
            t.map((s) => s.textContent));
    
            expect(names.length).to.equal(1);
            expect(names[0]).to.contains(`${mockData.catalog[0].model}`);
    
            expect(await page.isVisible('text="More Info"')).to.be.true;
    
    
        });
    
    });
});

async function setupContext(context) {
    // Block external calls
    await context.route(
        (url) => url.href.slice(0, host.length) != host,
        (route) => {
            if (DEBUG) {
                console.log("Preventing external call to " + route.request().url());
            }
            route.abort();
        }
    );
}

function handle(match, handlers) {
    return handleRaw.call(page, match, handlers);
}

function handleContext(context, match, handlers) {
    return handleRaw.call(context, match, handlers);
}

async function handleRaw(match, handlers) {
    const methodHandlers = {};
    const result = {
        get: (returns, options) => request("GET", returns, options),
        post: (returns, options) => request("POST", returns, options),
        put: (returns, options) => request("PUT", returns, options),
        patch: (returns, options) => request("PATCH", returns, options),
        del: (returns, options) => request("DELETE", returns, options),
        delete: (returns, options) => request("DELETE", returns, options),
    };

    const context = this;

    await context.route(urlPredicate, (route, request) => {
        if (DEBUG) {
            console.log(">>>", request.method(), request.url());
        }

        const handler = methodHandlers[request.method().toLowerCase()];
        if (handler == undefined) {
            route.continue();
        } else {
            handler(route, request);
        }
    });

    if (handlers) {
        for (let method in handlers) {
            if (typeof handlers[method] == "function") {
                handlers[method](result[method]);
            } else {
                result[method](handlers[method]);
            }
        }
    }

    return result;

    function request(method, returns, options) {
        let handled = false;

        methodHandlers[method.toLowerCase()] = (route, request) => {
            handled = true;
            route.fulfill(respond(returns, options));
        };

        return {
            onRequest: () => context.waitForRequest(urlPredicate),
            onResponse: () => context.waitForResponse(urlPredicate),
            isHandled: () => handled,
        };
    }

    function urlPredicate(current) {
        if (current instanceof URL) {
            return current.href.toLowerCase().endsWith(match.toLowerCase());
        } else {
            return current.url().toLowerCase().endsWith(match.toLowerCase());
        }
    }
}

function respond(data, options = {}) {
    options = Object.assign(
        {
            json: true,
            status: 200,
        },
        options
    );

    const headers = {
        "Access-Control-Allow-Origin": "*",
    };
    if (options.json) {
        headers["Content-Type"] = "application/json";
        data = JSON.stringify(data);
    }

    return {
        status: options.status,
        headers,
        body: data,
    };
}