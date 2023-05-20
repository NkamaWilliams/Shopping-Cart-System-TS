var Item = /** @class */ (function () {
    function Item(_name, _price, _quantity) {
        if (_quantity === void 0) { _quantity = 1; }
        this._name = _name;
        this._price = _price;
        this._quantity = _quantity;
        this._name = _name;
        this._price = _price;
        this._quantity = _quantity;
    }
    Item.prototype.getName = function () { return this._name; };
    Item.prototype.getPrice = function () { return this._price; };
    Item.prototype.getQuantity = function () { return this._quantity; };
    Item.prototype.setName = function (name) { this._name = name; };
    Item.prototype.setPrice = function (price) { this._price = price; };
    Item.prototype.setQuantity = function (quantity) { this._quantity = quantity; };
    return Item;
}());
var User = /** @class */ (function () {
    function User(_name, _email, _password) {
        this._name = _name;
        this._email = _email;
        this._password = _password;
        this._name = _name;
        this._email = /\w[\w\d_]+@\w+\.com/.test(_email) ? _email : "";
        this._password = _password;
    }
    User.prototype.getEmail = function () { return this._email; };
    User.prototype.getName = function () { return this._name; };
    User.prototype.getPassword = function () { return this._password; };
    User.prototype.newEmail = function (email) {
        this._email = /\w[\w\d_]+@\w+\.com/.test(email) ? email : "";
    };
    User.prototype.newPassword = function (password) {
        this._password = password;
    };
    return User;
}());
var ShoppingCart = /** @class */ (function () {
    function ShoppingCart(_user) {
        this._user = _user;
        this._items = [];
        this._user = _user;
    }
    ShoppingCart.prototype.getName = function () { return this._user.getName(); };
    ShoppingCart.prototype.getMail = function () { return this._user.getEmail(); };
    ShoppingCart.prototype.getItems = function () { return this._items; };
    ShoppingCart.prototype.addItem = function (item) {
        var _this = this;
        var available = true;
        this._items.forEach(function (i) {
            if (i.getName() === item.getName()) {
                available = false;
                var index = _this._items.indexOf(i);
                _this._items[index].setQuantity(item.getQuantity());
            }
        });
        if (available && item.getQuantity() > 0) {
            this._items.push(item);
        }
    };
    ShoppingCart.prototype.removeItem = function (name) {
        var _this = this;
        var index = -1;
        this._items.forEach(function (item) {
            if (item.getName() === name.getName()) {
                index = _this._items.indexOf(item);
            }
        });
        this._items = this._items.splice(0, index).concat(this._items.splice(index + 1));
    };
    ShoppingCart.prototype.calculateTotalCost = function () {
        var total = 0;
        this._items.forEach(function (item) {
            total += item.getPrice() * item.getQuantity();
        });
        return total;
    };
    return ShoppingCart;
}());
function toUser(name, email, password) {
    var user = new User(name, email, password);
    return user;
}
function toItem(name, price, quantity) {
    var item = new Item(name, price, quantity);
    return item;
}
function toCart(user) {
    return new ShoppingCart(user);
}
function getCart() {
    var cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    var tempCart = new ShoppingCart(toUser(cart._user._name, cart._user._email, cart._user._password));
    cart._items.forEach(function (item) {
        tempCart.addItem(toItem(item._name, item._price, item._quantity));
    });
    return tempCart;
}
function getRegisteredUser(mail, password) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log("my-mail:" + mail + "\nmy-password:" + password);
    var wrongPassword = false;
    var myUser = false;
    users.forEach(function (user) {
        console.log("user-mail: " + user._email + "\tuser-password: " + user._password);
        if (user._email === mail && user._password === password) {
            console.log("Found User!");
            myUser = toUser(user._name, user._email, user._password);
            return myUser;
        }
        if (user._email === mail && user._password !== password) {
            wrongPassword = true;
        }
    });
    if (myUser === false) {
        console.log("User not found!");
        return wrongPassword;
    }
    else {
        return myUser;
    }
}
function registerUser(name, email, password) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var available = true;
    if (users.length !== 0) {
        users.forEach(function (user) {
            if (user._email === email && user._password === password) {
                window.alert("Account already registered!");
                available = false;
            }
        });
    }
    if (available) {
        users.push(new User(name, email, password));
        localStorage.setItem("users", JSON.stringify(users));
    }
}
function loadPreviousSession(user) {
    var sessions = JSON.parse(localStorage.getItem("carts") || "[]");
    var sessionIndex = -1;
    var found = -1;
    if (sessions.length > 0) {
        alert("I am in sessions");
        sessions.forEach(function (cart) {
            if (cart._user._email === user.getEmail()) {
                sessionIndex = sessions.indexOf(cart);
                found = 1;
            }
        });
        var session = sessions[sessionIndex];
        sessionStorage.setItem("cart", JSON.stringify(session));
    }
    else {
        sessionStorage.setItem("cart", JSON.stringify(new ShoppingCart(user)));
    }
    if (found === -1) {
        sessionStorage.setItem("cart", JSON.stringify(new ShoppingCart(user)));
    }
}
function saveSession() {
    var sessions = JSON.parse(localStorage.getItem("carts") || "[]");
    console.log("sessions:");
    console.log(sessions);
    var sessionIndex = -1;
    var currentSession = JSON.parse(sessionStorage.getItem("cart") || "[]");
    console.log("current session:");
    console.log(currentSession);
    if (sessions.length > 0) {
        sessions.forEach(function (cart) {
            if (cart._user._email === currentSession._user._email) {
                sessionIndex = sessions.indexOf(cart);
            }
        });
        if (sessionIndex > -1) {
            sessions[sessionIndex] = currentSession;
        }
        else {
            sessions.push(currentSession);
        }
        localStorage.setItem("carts", JSON.stringify(sessions));
    }
    else if (sessions.length === 0) {
        sessions.push(currentSession);
        localStorage.setItem("carts", JSON.stringify(sessions));
    }
}
function updateSession(cart) {
    sessionStorage.setItem("cart", JSON.stringify(cart));
}
function sign_up(e) {
    var inputs = e.getElementsByTagName('input');
    var name = inputs[0].value;
    var email = inputs[1].value;
    var password = inputs[2].value;
    var cpassword = inputs[3].value;
    if (password !== cpassword) {
        e.getElementsByClassName("error")[0].style.display = "block";
        return false;
    }
    else {
        e.getElementsByClassName("error")[0].style.display = "none";
    }
    registerUser(name, email, password);
    window.location.href = "./sign_in.html";
    return false;
}
function sign_in(e) {
    var inputs = e.getElementsByTagName('input');
    var mail = inputs[0].value, password = inputs[1].value;
    var user = getRegisteredUser(mail, password);
    if (user === false) {
        alert("No such user!");
    }
    else if (user === true) {
        e.getElementsByClassName("error")[0].style.display = "block";
    }
    else if (user instanceof User) {
        sessionStorage.setItem("user", JSON.stringify(user));
        loadPreviousSession(user);
        window.location.href = "./home.html";
    }
    return false;
}
function decrement(e) {
    var input = e.parentNode.children[1];
    input.value = Number(input.value) === 0 ? 0 : Number(input.value) - 1;
}
function increment(e) {
    var input = e.parentNode.children[1];
    input.value = Number(input.value) + 1;
}
function addItem(e, name, price) {
    var amount = e.parentNode.children[1].children[1];
    var cart = getCart();
    var items = cart.getItems();
    items.forEach(function (item) {
        if (item.getName() === name) {
            cart.removeItem(items[items.indexOf(item)]);
        }
    });
    cart.addItem(toItem(name, price, amount.value));
    console.log(cart);
    updateSession(cart);
    saveSession();
    amount.value = 0;
}
function fill(e) {
    var cart = getCart();
    console.log(cart);
    var pName = document.getElementById("name");
    if (pName) {
        console.log(pName);
        pName.innerHTML = cart.getName();
    }
    if (cart.getItems().length > 0) {
        var article_1 = document.getElementsByTagName('article')[0];
        cart.getItems().forEach(function (item) {
            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            var div3 = document.createElement("div");
            div2.classList.add("cart-info");
            div3.classList.add("delete");
            div3.appendChild(document.createTextNode("Delete"));
            var p = document.createElement("p");
            var span = document.createElement("span");
            var h3 = document.createElement("h3");
            p.appendChild(document.createTextNode("".concat(item.getName())));
            span.appendChild(document.createTextNode(" x ".concat(item.getQuantity())));
            p.appendChild(span);
            h3.appendChild(document.createTextNode("N".concat(item.getPrice() * item.getQuantity())));
            div2.appendChild(p);
            div2.appendChild(h3);
            div3.addEventListener('click', function () {
                var _a, _b;
                console.log("I've been clicked!");
                var cart = getCart();
                var name = ((_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('p')[0].textContent) || "";
                var spanText = ((_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByTagName('span')[0].textContent) || "";
                name = name === null || name === void 0 ? void 0 : name.slice(0, name.indexOf(spanText));
                console.log(name);
                cart.getItems().forEach(function (itm) {
                    if (itm.getName() == name) {
                        cart.removeItem(itm);
                        updateSession(cart);
                    }
                });
                location.reload();
            });
            div1.appendChild(div2);
            div1.appendChild(div3);
            article_1.prepend(div1);
        });
    }
    document.getElementsByTagName('b')[0].textContent = "".concat(cart.calculateTotalCost());
}
