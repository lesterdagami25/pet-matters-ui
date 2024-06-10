const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "pos", component: () => import("pages/PosPage.vue") },
      {
        path: "product",
        component: () => import("src/pages/ProductPage.vue"),
      },
      {
        path: "sale",
        component: () => import("src/pages/SaleProductPage.vue"),
      },
      {
        path: "my-appointment",
        component: () => import("src/pages/AppointmentPage.vue"),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "login", component: () => import("pages/LoginPage.vue") },
      { path: "signup", component: () => import("pages/SignupPage.vue") },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
