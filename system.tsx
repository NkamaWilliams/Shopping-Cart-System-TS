
class Item {
    constructor(private _name:string, private _price:number, private _quantity:number = 1){
        this._name = _name
        this._price = _price
        this._quantity = _quantity
    }
    
    public getName():string{return this._name}
    public getPrice():number{return this._price}
    public getQuantity():number{return this._quantity}

    public setName(name:string):void {this._name = name}
    public setPrice(price:number):void{this._price = price}
    public setQuantity(quantity:number):void{this._quantity = quantity}
}

class User{
    constructor(private _name:string, private _email:string, private _password: string){
        this._name = _name
        this._email = /\w[\w\d_]+@\w+\.com/.test(_email)? _email: ""
        this._password = _password
    }

    public getEmail():string {return this._email}
    public getName():string {return this._name}
    public getPassword():string {return this._password}

    public newEmail(email:string): void{
        this._email = /\w[\w\d_]+@\w+\.com/.test(email)? email: ""
    }
    public newPassword(password:string):void {
        this._password = password
    }
    
}

class ShoppingCart{
    private _items: Item[] = []
    constructor(private _user:User){
        this._user = _user
    }

    public getName(): string {return this._user.getName()}

    public getMail():string {return this._user.getEmail()}

    public getItems():Item[] {return this._items}

    public addItem(item:Item){
        let available: boolean = true
        this._items.forEach(i => {
            if (i.getName() === item.getName()){
                available = false
                let index = this._items.indexOf(i)
                this._items[index].setQuantity(item.getQuantity())
            }
        })
        if (available && item.getQuantity() > 0){
            this._items.push(item)
        }
    }

    public removeItem(name:Item){
        let index = -1
        this._items.forEach(item => {
            if (item.getName() === name.getName()){
                index = this._items.indexOf(item)
            }
        })
        this._items = this._items.splice(0, index).concat(this._items.splice(index+1))
    }

    public calculateTotalCost():number{
        let total: number = 0
        this._items.forEach(item => {
            total += item.getPrice() * item.getQuantity()
        })
        return total
    }
}

function toUser(name:string, email:string, password:string):User{
    let user:User = new User(name, email, password)
    return user
}

function toItem(name:string, price:number, quantity:number): Item{
    let item:Item = new Item(name, price, quantity)
    return item
}

function toCart(user:User): ShoppingCart{
    return new ShoppingCart(user)
}

function getCart(): ShoppingCart{
    let cart: cart = JSON.parse(sessionStorage.getItem("cart") || "[]")
    let tempCart = new ShoppingCart(toUser(cart._user._name, cart._user._email, cart._user._password))
    cart._items.forEach(item => {
        tempCart.addItem(toItem(item._name, item._price, item._quantity))
    })
    return tempCart
}

interface user{
    _name:string,
    _email:string,
    _password:string
}

interface item{
    _name: string,
    _price: number,
    _quantity: number
}

interface cart{
    _user: user,
    _items: Array<item>
}

function getRegisteredUser(mail:string, password:string): User|boolean{
    let users: Array<user> = JSON.parse(localStorage.getItem('users') || '[]')
    console.log("my-mail:"+mail+"\nmy-password:"+password)
    let wrongPassword: boolean = false
    let myUser: User|false = false
    users.forEach(user => {
        console.log("user-mail: "+user._email+"\tuser-password: "+user._password)
        if (user._email === mail && user._password === password){
            console.log("Found User!")
            myUser = toUser(user._name, user._email, user._password)
            return myUser
        }
        if (user._email === mail && user._password !== password){
            wrongPassword = true
        }
    })

    if (myUser === false){
        console.log("User not found!")
        return wrongPassword
    }
    else{
        return myUser
    }
}

function registerUser(name:string, email:string, password:string):void{
    let users: Array<any> = JSON.parse(localStorage.getItem('users') || '[]')
    let available: boolean = true

    if (users.length !== 0){        
        users.forEach(user => {
            if (user._email === email && user._password === password){
                window.alert("Account already registered!")
                available = false
            }
        })
    }

    if (available){
        users.push(new User(name, email, password))
        localStorage.setItem("users", JSON.stringify(users))
    }
}

function loadPreviousSession(user:User): void{
    let sessions: Array<cart> = JSON.parse(localStorage.getItem("carts") || "[]")
    let sessionIndex = -1
    let found = -1

    if (sessions.length > 0){
        sessions.forEach(cart => {
            if (cart._user._email === user.getEmail()){
                sessionIndex = sessions.indexOf(cart)
                found = 1
            }
        })

        let session = sessions[sessionIndex]
        sessionStorage.setItem("cart", JSON.stringify(session))
    }

    else{
        sessionStorage.setItem("cart", JSON.stringify(new ShoppingCart(user)))
    }

    if (found === -1){
        sessionStorage.setItem("cart", JSON.stringify(new ShoppingCart(user)))
    }
    
}

function saveSession():void{
    let sessions: Array<cart> = JSON.parse(localStorage.getItem("carts") || "[]")
    console.log("sessions:")
    console.log(sessions)
    let sessionIndex = -1
    let currentSession: cart = JSON.parse(sessionStorage.getItem("cart") || "[]")
    console.log("current session:")
    console.log(currentSession)

    if (sessions.length > 0){
        sessions.forEach(cart => {
            if (cart._user._email === currentSession._user._email){
                sessionIndex = sessions.indexOf(cart)
            }
        })

        if (sessionIndex > -1){
            sessions[sessionIndex] = currentSession
        }
        
        else{
            sessions.push(currentSession)
        }

        localStorage.setItem("carts", JSON.stringify(sessions))
    }

    else if(sessions.length === 0){
        sessions.push(currentSession)
        localStorage.setItem("carts", JSON.stringify(sessions))
    }
}

function updateSession(cart: ShoppingCart):void{
    sessionStorage.setItem("cart", JSON.stringify(cart))
}

function sign_up(e:any): boolean{
    let inputs = e.getElementsByTagName('input')
    let name:string = inputs[0].value
    let email:string = inputs[1].value
    let password:string = inputs[2].value
    let cpassword:string = inputs[3].value

    if (password !== cpassword){
        e.getElementsByClassName("error")[0].style.display = "block"
        return false
    }

    else{
        e.getElementsByClassName("error")[0].style.display = "none"
    }

    registerUser(name, email, password)

    window.location.href = "./index.html"
    return false
}

function sign_in(e:any): boolean{
    let inputs = e.getElementsByTagName('input')
    let mail:string = inputs[0].value, password:string = inputs[1].value
    let user = getRegisteredUser(mail, password)
    if (user === false){
        alert("No such user!")
    }
    else if (user === true){
        e.getElementsByClassName("error")[0].style.display = "block"
    }

    else if (user instanceof User){
        sessionStorage.setItem("user", JSON.stringify(user))
        loadPreviousSession(user)
        window.location.href = "./home.html"
    }
    return false
}

function decrement(e:any):void{
    let input = e.parentNode.children[1]
    input.value = Number(input.value) === 0? 0:Number(input.value) - 1
}

function increment(e:any):void{
    let input = e.parentNode.children[1]
    input.value = Number(input.value) + 1
}

function addItem(e:any, name:string, price:number){
    let amount = e.parentNode.children[1].children[1]
    let cart = getCart()
    let items = cart.getItems()
    items.forEach(item => {
        if (item.getName() === name){
            cart.removeItem(items[items.indexOf(item)])
        }
    })
    cart.addItem(toItem(name, price, amount.value))
    console.log(cart)
    updateSession(cart)
    saveSession()
    amount.value = 0
}

function fill(e:any):void{
    let cart = getCart()
    console.log(cart)
    let pName = document.getElementById("name")
    if (pName){
        console.log(pName)
        pName.innerHTML = cart.getName()
    }
    if (cart.getItems().length > 0){
        let article = document.getElementsByTagName('article')[0]

        cart.getItems().forEach(item => {
            let div1 = document.createElement("div")
            let div2 = document.createElement("div")
            let div3 = document.createElement("div")

            div2.classList.add("cart-info")
            div3.classList.add("delete")
            div3.appendChild(document.createTextNode("Delete"))
            
            let p = document.createElement("p")
            let span = document.createElement("span")
            let h3 = document.createElement("h3")

            p.appendChild(document.createTextNode(`${item.getName()}`))
            span.appendChild(document.createTextNode(` x ${item.getQuantity()}`))
            p.appendChild(span)

            h3.appendChild(document.createTextNode(`N${item.getPrice() * item.getQuantity()}`))

            div2.appendChild(p)
            div2.appendChild(h3)

            div3.addEventListener('click', function(this) {
                console.log("I've been clicked!")
                let cart = getCart()
                let name:string = this.parentElement?.getElementsByTagName('p')[0].textContent || ""
                let spanText:string = this.parentElement?.getElementsByTagName('span')[0].textContent || ""
                name = name?.slice(0, name.indexOf(spanText))
                console.log(name)
                cart.getItems().forEach(itm => {
                    if (itm.getName() == name){
                        cart.removeItem(itm)
                        updateSession(cart)
                    }
                })

                location.reload()
            })

            div1.appendChild(div2)
            div1.appendChild(div3)
            
            article.prepend(div1)
        })
    }

    document.getElementsByTagName('b')[0].textContent = `${cart.calculateTotalCost()}`
}
