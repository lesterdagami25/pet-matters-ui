<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-7">
        <q-table wrap-cells flat bordered title="Products and Services List" :rows="products" :filter="filter"
          :columns="columns" row-key="productCode">
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="image" :props="props">
                <q-img style="height: auto; width: 54px" :src="`http://localhost:1337${props.row.image}`" />
              </q-td>
              <q-td key="productCode" :props="props">
                {{ props.row.productCode }}
              </q-td>
              <q-td key="productName" :props="props">
                {{ props.row.productName }}
              </q-td>
              <q-td key="productDescription" :props="props">
                {{ props.row.productDescription }}
              </q-td>
              <q-td key="category" :props="props">
                {{ props.row.category }}
              </q-td>
              <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td>
              <q-td key="price" :props="props">
                {{ props.row.price }}
              </q-td>
              <q-td key="_id" :props="props">
                <q-btn @click="onRowClick(props.row)" color="primary" icon="add_shopping_cart" dense />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-5">
        <q-table wrap-cells flat bordered title="Order List" :rows="orders" :filter="filter1" :columns="columns1"
          row-key="productCode">
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter1" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="image" :props="props">
                <q-img style="height: auto; width: 54px" :src="`http://localhost:1337${props.row.image}`" />
              </q-td>
              <q-td key="productCode" :props="props">
                {{ props.row.productCode }}
              </q-td>
              <q-td key="productName" :props="props">
                {{ props.row.productName }}
              </q-td>
              <q-td key="productDescription" :props="props">
                {{ props.row.productDescription }}
              </q-td>
              <q-td key="category" :props="props">
                {{ props.row.category }}
              </q-td>
              <q-td key="quantity" :props="props">
                <q-input v-model="props.row.buy_quantity" type="number" />
              </q-td>
              <q-td key="price" :props="props">
                {{ props.row.price }}
              </q-td>
              <q-td key="_id" :props="props">
                <q-btn @click="removeItem(props.row)" color="red" flat round icon="delete" dense />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-card class="q-mt-md">
          <q-card-section>
            <q-input type="number" v-model="payment" label="Cash Payment" />
          </q-card-section>
          <q-card-section class="q-py-xs">
            <div class="text-h6">
              Total Price:
              {{
                orders.reduce((a, b) => a + b.price * b.buy_quantity, 0).toFixed(2)
              }}
            </div>
          </q-card-section>
          <q-card-section class="q-py-xs">
            <div class="text-h6">
              Change:
              {{
                (
                  payment - orders.reduce((a, b) => a + b.price * b.buy_quantity, 0)
                ).toFixed(2)
              }}
            </div>
          </q-card-section>

          <q-card-actions align="between">
            <q-btn :disable="orders.length === 0" @click="saveToSale()" unelevated label="Confirm buy" color="primary"
              icon="save" />
            <q-btn :disable="orders.length === 0" color="primary" @click="
              payment = 0;
            orders = [];
            " icon="restart_alt" label="Clear" outline />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { useQuasar } from "quasar";
import { onMounted, ref, getCurrentInstance } from "vue";

defineOptions({
  name: "PosPage",
});

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const products = ref([]);
const orders = ref([]);
const $q = useQuasar();
const payment = ref(0);
const filter = ref("");
const filter1 = ref("");

const columns = [
  { name: "image", label: "Product Image", field: "image", align: "left" },
  {
    name: "productCode",
    required: true,
    label: "Product / Services Code",
    sortable: true,
    align: "left",
  },
  {
    name: "productName",
    align: "productName",
    label: "Product / Services Name",
    field: "productName",
    sortable: true,
    align: "left",
  },
  {
    name: "productDescription",
    label: "Product / Services Description",
    field: "productDescription",
    sortable: true,
    align: "left",
  },
  { name: "category", label: "Category", field: "category", align: "left" },
  { name: "quantity", label: "Quantity", field: "quantity", align: "left" },
  { name: "price", label: "Price", field: "price", align: "left" },
  { name: "_id", label: "Action", field: "_id", align: "left" },
];

const columns1 = [
  { name: "image", label: "Product Image", field: "image", align: "left" },
  {
    name: "productCode",
    required: true,
    label: "Product / Services Code",
    sortable: true,
    align: "left",
  },
  {
    name: "productName",
    align: "productName",
    label: "Product / Services Name",
    field: "productName",
    sortable: true,
    align: "left",
  },
  // {
  //   name: "productDescription",
  //   label: "Product Description",
  //   field: "productDescription",
  //   sortable: true,
  //   align: "left",
  // },
  // { name: "category", label: "Category", field: "category", align: "left" },
  { name: "quantity", label: "Quantity", field: "quantity", align: "left" },
  { name: "price", label: "Price", field: "price", align: "left" },
  { name: "_id", label: "Action", field: "_id", align: "left" },
];

onMounted(() => {
  fetchProducts();
});

const generatePdf = (products, cashPayment, totalPrice, change) => {
  // Define the table headers
  const tableHeaders = [
    { text: "Product Code", style: "tableHeader" },
    { text: "Product Name", style: "tableHeader" },
    { text: "Product Description", style: "tableHeader" },
    { text: "Category", style: "tableHeader" },
    { text: "Quantity", style: "tableHeader" },
    { text: "Price", style: "tableHeader" },
  ];

  // Map your products array to table rows
  const tableBody = products.map((product) => [
    { text: product.productCode, style: "tableBody" },
    { text: product.productName, style: "tableBody" },
    { text: product.productDescription, style: "tableBody" },
    { text: product.category, style: "tableBody" },
    { text: product.buy_quantity, style: "tableBody" },
    { text: product.price, style: "tableBody" },
  ]);

  // Add the headers at the beginning of the body
  tableBody.unshift(tableHeaders);

  const docDefinition = {
    content: [
      { text: "Pet Matter", style: "mainHeader" },
      { text: "Product List", style: "header" },
      {
        style: "tableExample",
        table: {
          headerRows: 1,
          body: tableBody,
        },
        layout: "lightHorizontalLines",
      },
      {
        text: "Payment Details",
        style: "subheader",
        margin: [0, 20, 0, 10],
      },
      {
        columns: [
          { text: `Cash Payment:`, style: "paymentDetailLabel" },
          { text: `${cashPayment}`, style: "paymentDetailValue" },
        ],
      },
      {
        columns: [
          { text: `Total Price:`, style: "paymentDetailLabel" },
          { text: `${totalPrice}`, style: "paymentDetailValue" },
        ],
      },
      {
        columns: [
          { text: `Change:`, style: "paymentDetailLabel" },
          { text: `${change}`, style: "paymentDetailValue" },
        ],
      },
    ],
    styles: {
      mainHeader: {
        fontSize: 26,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      header: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
      tableBody: {
        fontSize: 11,
      },
      paymentDetailLabel: {
        bold: true,
        fontSize: 12,
        margin: [0, 2, 0, 2],
      },
      paymentDetailValue: {
        fontSize: 12,
        margin: [0, 2, 0, 2],
      },
    },
  };
  // Create the PDF
  pdfMake.createPdf(docDefinition).download("receipt.pdf");
};

const fetchProducts = () => {
  $api
    .get("/products?pagination[limit]=5000&sort=updatedAt:desc")
    .then((response) => {
      console.log(response.data.data);
      products.value = response.data.data;
    })
    .catch((error) => {
      console.log("error");
    });
};

const onRowClick = (row) => {
  let order = { ...row };
  order.buy_quantity = 1;

  orders.value.push(order);
};

const removeItem = (row) => {
  const index = orders.value.findIndex((product) => product.id === row.id);
  orders.value.splice(index, 1);
};

const lessProduct = async (order) => {
  const payload = {
    data: {
      quantity: order.quantity - order.buy_quantity,
    },
  };
  const responseProducts = await $api.put(`/products/${order.id}`, payload);
};

const proceedToSaveSale = async (row) => {
  try {
    for (const order of orders.value) {
      const payload = {
        data: order,
      };

      const response = await $api.post("/sales", payload);
      await lessProduct(order);
      console.log(response);
    }
    fetchProducts();
  } catch (error) {
    console.log("error", error);
  }

  const totalPrice = orders.value
    .reduce((a, b) => a + b.price * b.buy_quantity, 0)
    .toFixed(2);
  const change =
    payment.value - totalPrice
  generatePdf(orders.value, payment.value, totalPrice, change.toFixed(2));

  orders.value = [];
  payment.value = 0;
  $q.notify({
    type: "positive",
    message: "Success!",
  });
};

const saveToSale = async () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to proceed?",
    ok: {
      unelevated: true,
      color: "primary",
    },
    cancel: {
      flat: true,
      color: "primary",
    },
    persistent: true,
  })
    .onOk(() => {
      proceedToSaveSale();
      // console.log('>>>> secondn OK catcher')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
</script>
