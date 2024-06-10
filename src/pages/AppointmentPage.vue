<template>
  <q-page padding>
    <div class="row q-pa-md q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-5 text-center">
        <q-date v-model="selectedDate" mask="YYYY-MM-DD" format="YYYY-MM-DD" @update:model-value="fetchTime"
          label="Select Date" :options="enableFutureDates" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4" v-if="selectedDate">
        <div class="q-mb-md">Select Time:</div>
        <div class="row q-gutter-sm">
          <q-btn :disable="notAvailableTimes.includes(time)" v-for="time in generateAvailableTimes" :key="time"
            :label="time" :text-color="selectedTime === time ? 'white' : 'primary'"
            :color="selectedTime === time ? 'primary' : 'white'" @click="selectTime(time)" class="q-mb-sm" />
        </div>
        <q-btn v-if="user.type === 'user'" class="q-mt-md" color="primary" label="Book Appointment"
          :disabled="!selectedTime" icon="pending_actions" @click="
            appointmentDetails = {};
          action = 'book';
          dialogLayout = true;
          " />
      </div>
    </div>

    <q-table wrap-cells flat bordered title="My appointment" :rows="reservations" :filter="filter" :columns="columns"
      row-key="productCode">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.user.name }}
          </q-td>
          <q-td key="phoneNumber" :props="props">
            {{ props.row.user.phoneNumber }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.user.email }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.user.address }}
          </q-td>
          <q-td key="petType" :props="props">
            {{ props.row.petType }}
          </q-td>
          <q-td key="breed" :props="props">
            {{ props.row.breed }}
          </q-td>
          <q-td key="petAge" :props="props">
            {{ props.row.petAge }}
          </q-td>
          <q-td key="services" :props="props">
            {{ props.row.services }}
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="time" :props="props">
            {{ props.row.time }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="_id" :props="props">
            <q-btn color="primary" @click="
              action = 'view';
            appointmentDetails = props.row;
            dialogLayout = true;
            " label="View" icon="visibility" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogLayout">
      <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>{{
              action === "book" ? "Add additional details" : "View details"
              }}</q-toolbar-title>
            <q-btn flat @click="dialogLayout = !dialogLayout" label="Close" dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer class="bg-white">
          <q-toolbar>
            <q-toolbar-title></q-toolbar-title>
            <q-btn @click="submit()" color="primary" icon="save" :label="action === 'book' ? 'Book now' : 'Save'" />
          </q-toolbar>
        </q-footer>

        <q-page-container>
          <q-page padding class="q-col-gutter-md">
            <q-select outlined :options="['CAT', 'DOG']" label="Pet Type" v-model="appointmentDetails.petType"
              :readonly="action === 'view'" />
            <q-select outlined :options="['SPAY', 'CHECK UP', 'GROOMING', 'DEWORM']" label="Service"
              v-model="appointmentDetails.services" :readonly="action === 'view'" />
            <q-input outlined v-model="appointmentDetails.breed" label="Breed" :readonly="action === 'view'" />
            <q-select outlined :options="[
              'LESS THAN 1 YEAR OLD',
              '1-3 YEARS OLD',
              '3-6 YEARS OLD',
            ]" label="Pet Age" v-model="appointmentDetails.petAge" :readonly="action === 'view'" />
            <q-input outlined v-model="appointmentDetails.ownerName" label="Owner name" :readonly="action === 'view'" />
            <q-input outlined v-model="appointmentDetails.ownerAddress" label="Owner address"
              :readonly="action === 'view'" />

            <q-select v-if="action !== 'book' && user.type === 'admin'" outlined
              :options="['Pending', 'Approved', 'Done', 'Declined']" label="Status"
              v-model="appointmentDetails.status" />

            <!-- <q-select v-if="action !== 'book' && user.type === 'user'" outlined :options="['Cancel']" label="Status" -->
            <!-- v-model="appointmentDetails.status" /> -->

            <!-- <q-input outlined v-if="appointmentDetails.status === 'Cancelled'" v-model="appointmentDetails.remarks" -->
            <!-- label="Reason to decline" /> -->
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from "vue";

import { date, useQuasar } from "quasar";

const $q = useQuasar();
const quasarDate = date;
const selectedDate = ref(quasarDate.formatDate(Date.now(), "YYYY-MM-DD"));
const selectedTime = ref("");
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const reservations = ref([]);
let user = $q.localStorage.getItem("user");
const filter = ref("");

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    sortable: true,
    align: "left",
  },
  {
    name: "phoneNumber",
    align: "phoneNumber",
    label: "Phone Number",
    field: "phoneNumber",
    sortable: true,
    align: "left",
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
    align: "left",
  },
  { name: "address", label: "Address", field: "address", align: "left" },
  { name: "petType", label: "Pet Type", field: "petType", align: "left" },
  { name: "breed", label: "Breed", field: "breed", align: "left" },
  { name: "petAge", label: "Pet Age", field: "petAge", align: "left" },
  { name: "services", label: "Services", field: "services", align: "left" },
  { name: "date", label: "Date", field: "date", align: "left" },
  { name: "time", label: "Time", field: "time", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "_id", label: "Action", field: "_id", align: "left" },
];

const dialogLayout = ref(false);
const action = ref("");
const notAvailableTimes = ref([]);

const appointmentDetails = ref({
  petType: "",
  breed: "",
  petAge: "",
  services: "",
  status: "",
});

onMounted(() => {
  let url = "";
  if (user.type === "user") {
    url = `/reservations?pagination[limit]=5000&filters[user][id][$eq]=${user.id}&sort=updatedAt:desc&populate=*`;
  } else {
    url = `/reservations?pagination[limit]=5000&sort=updatedAt:desc&populate=*`;
  }

  $api
    .get(url)
    .then((response) => {
      reservations.value = response.data.data;
    })
    .catch((error) => {
      console.log("error", error);
    });

  fetchTime(quasarDate.formatDate(Date.now(), "YYYY-MM-DD"));
});

const enableFutureDates = (date) => {
  const timeStamp = Date.now();
  return date >= quasarDate.formatDate(timeStamp, "YYYY/MM/DD");
};
const generateAvailableTimes = computed(() => {
  const times = [];
  const startHour = 8;
  const endHour = 16;
  for (let hour = startHour; hour <= endHour; hour++) {
    times.push(formatTime(hour, 0));
    //times.push(formatTime(hour, 30));
  }
  return times;
});

const formatTime = (hour, minute) => {
  const period = hour < 12 ? "AM" : "PM";
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${padZero(adjustedHour)}:${padZero(minute)} ${period}`;
};
const padZero = (number) => {
  return number < 10 ? `0${number}` : number;
};
const selectTime = (time) => {
  selectedTime.value = time;
};

const submit = async () => {
  if (appointmentDetails.value.petType &&
    appointmentDetails.value.services &&
    appointmentDetails.value.breed &&
    appointmentDetails.value.petAge &&
    appointmentDetails.value.ownerName &&
    appointmentDetails.value.ownerAddress
  ) {
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
        if (action.value === "book") {
          bookNow();
        } else if (action.value === "view") {
          updateAppointment();
        }
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  } else {
    $q.notify({
      type: "negative",
      message: "All fields are required!",
    });
  }
};

const bookNow = async (row) => {
  const payload = {
    data: {
      petType: appointmentDetails.value.petType,
      breed: appointmentDetails.value.breed,
      petAge: appointmentDetails.value.petAge,
      services: appointmentDetails.value.services,
      ownerName: appointmentDetails.value.ownerName,
      ownerAddress: appointmentDetails.value.ownerAddress,
      status: "Pending",
      date: selectedDate.value,
      time: selectedTime.value,
      user: user.id,
    },
  };

  const response = await $api.post("/reservations?populate=*", payload);

  console.log(response.data.data);
  reservations.value.unshift(response.data.data);
  dialogLayout.value = false;
  $q.notify({
    type: "positive",
    message: "Success!",
  });
};

const updateAppointment = async () => {
  const payload = {
    data: {
      status: appointmentDetails.value.status,
    },
  };

  const response = await $api.put(
    `/reservations/${appointmentDetails.value.id}`,
    payload
  );

  dialogLayout.value = false;
  $q.notify({
    type: "positive",
    message: "Success!",
  });
};

const fetchTime = (value, reason, details) => {
  console.log("value", value);
  console.log("value", reason);
  console.log("details", details);
  $api
    .get(`/reservations?pagination[limit]=5000&filters[date][$eq]=${value}}&filters[status][$nin]=["Declined", "Cancelled"]`)
    .then((response) => {
      notAvailableTimes.value = response.data.data.map(
        (reservation) => reservation.time
      );
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>

<style scoped></style>
