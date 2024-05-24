/**
 * path:
 * / jellel kezdődik
 * component:
 * a components mappában megtalálható komponens (kis/nagybetű érzékeny a neve!)
 * saját komponens lehet, ilyenkor az alkönyvtárat is bele lehet írni
 * pl: public/Drinks
 * roles:
 * "waiter"
 * "bartender"
 * "backoffice"
 * "unauth" (nem belépett felhasználóknak)
 * "all" (alapértelmezett, nincs jogosultság ellenőrzés, ugyanaz, mint a [])
 */
const publicRoutes = [
    {
        "path": "/",
        "component": "common/Dashboard",
        "roles": []
    },
    { // regisztráció
        "path": "/register",
        "component": "public/Register",
        "roles": ["unauth"]
    },
    { // regisztráció megerősítése
        "path": "/confirm-registration/:id/:token",
        "component": "public/ConfirmRegistration",
        "roles": ["unauth"]
    },
    { // regisztráció megerősítési email újraküldése
        "path": "/resend-registration/",
        "component": "public/ResendRegistration",
        "roles": ["unauth"]
    },
    { // elfelejtett jelszó form
        "path": "/password",
        "component": "public/Password",
        "roles": ["unauth"]
    },
    { // elfelejtett jelszó megváltoztatása
        "path": "/reset-password/:id/:token",
        "component": "public/ResetPassword",
        "roles": ["unauth"]
    },
    {
        "path": "/login",
        "component": "common/Login",
        "roles": ["unauth"]
    },
    {
        "path": "/logout",
        "component": "common/Logout",
        "roles": ["auth"]
    },
    {
        "path": "/profile",
        "component": "common/Profile",
        "roles": ["auth"],
    },
    {
        "path": "/drinks",
        "component": "public/Drinks",
        "roles": ["auth","unauth"]
    },
    {
        "path": "/drink/:id",
        "component": "public/Drink",
        "roles": ["auth", "unauth"]
    },
    {
        "path": "/shopping-cart",
        "component": "public/ShoppingCart",
        "roles": ["auth","unauth"]
    },
    {
        "path": "/orders",
        "component": "public/Orders",
        "roles": ["auth"]
    },
    {
        "path": "/order/:id",
        "component": "public/Order",
        "roles": ["auth"]
    },
    {
        "path": "/my-orders",
        "component": "public/Orders",
        "roles": ["auth"]
    },
    {
        "path": "/about-us",
        "component": "public/AboutUs",
        "roles": ["auth","unauth"]
    },
    {
        "path": "/terms",
        "component": "common/Terms",
        "roles": ["auth", "unauth"]
    },
    {
        "path": "/privacy",
        "component": "common/Privacy",
        "roles": ["auth", "unauth"]
    },
    {
        "path": "/home",
        "component": "public/Home2",
        "roles": ["auth", "unauth"]
    },
]

export default publicRoutes