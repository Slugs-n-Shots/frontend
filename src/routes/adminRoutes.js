/**
 * path:
 * /admin/-nal kezdődik
 * component:
 * a components mappában megtalálható komponens (kis/nagybetű érzékeny a neve!)
 * saját komponens lehet, ilyenkor az alkönyvtárat is / jellel bele lehet írni
 * roles:
 * "auth" (belépett felhasználó)
 * "unauth" (nem belépett felhasználóknak)
 * "all" (alapértelmezett, nincs jogosultság ellenőrzés, ugyanaz, mint a [])
 */
const adminRoutes = [
    {
        "path": "/admin/",
        "component": "common/Dashboard",
        "roles": ["unauth"]
    },
    {
        "path": "/admin/register",
        "component": "admin/EmployeeRegister",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/drinks",
        "component": "admin/Drinks",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/guests",
        "component": "admin/Guests",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/login",
        "component": "common/Login",
        "roles": ["unauth"]
    },
    {
        "path": "/admin/logout",
        "component": "common/Dashboard",
        "roles": ["unauth"]
    },
    { // elfelejtett jelszó form
        "path": "/admin/password",
        "component": "public/Password",
        "roles": ["unauth"]
    },
    { // elfelejtett jelszó megváltoztatása
        "path": "/admin/reset-password/:id/:token",
        "component": "public/ResetPassword",
        "roles": ["unauth"]
    },
    {
        "path": "/admin/profile",
        "component": "common/Profile",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/drinks",
        "component": "admin/masters/DrinkMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/drink-categories",
        "component": "admin/masters/DrinkCategoryMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/orders",
        "component": "admin/masters/OrderMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/receipts",
        "component": "admin/masters/ReceiptMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/employees",
        "component": "admin/masters/EmployeeMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/masters/guests",
        "component": "admin/masters/GuestMaster",
        "roles": ["admin", "backoffice"]
    },
    {
        "path": "/admin/terms",
        "component": "common/Terms",
        "roles": ["auth", "unauth"]
    },
    {
        "path": "/admin/privacy",
        "component": "common/Privacy",
        "roles": ["auth", "unauth"]
    },
]

export default adminRoutes
