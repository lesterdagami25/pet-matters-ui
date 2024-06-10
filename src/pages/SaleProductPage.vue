<template>
  <q-page padding>
    <q-table wrap-cells flat bordered title="Sold Products" :rows="products" :columns="columns" row-key="productCode"
      :filter="filter">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
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
          <q-td key="buy_quantity" :props="props">
            {{ props.row.buy_quantity }}
          </q-td>
          <q-td key="price" :props="props">
            {{ props.row.price }}
          </q-td>
          <q-td key="quantity" :props="props">
            {{ props.row.price * props.row.buy_quantity }}
          </q-td>
          <!-- <q-td key="_id" :props="props">
            <q-btn label="Add" dense />
          </q-td> -->
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";

defineOptions({
  name: "PosPage",
});

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const products = ref([]);
const filter = ref("");

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
  { name: "buy_quantity", label: "Quantity", field: "buy_quantity", align: "left" },
  { name: "price", label: "Price", field: "price", align: "left" },
  { name: "quantity", label: "Total Price", field: "quantity", align: "left" },
  // { name: "_id", label: "Action", field: "_id", align: "left" },
];

onMounted(() => {
  $api
    .get("/sales?pagination[limit]=5000")
    .then((response) => {
      console.log(response.data.data);
      products.value = response.data.data;
    })
    .catch((error) => {
      console.log("error");
    });
});

const onRowClick = (row) => { };
</script>
