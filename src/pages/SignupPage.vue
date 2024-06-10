<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px; border-radius: 15px">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md text-center"
      >
        <q-img
          style="height: 144px; width: 144px"
          src="https://pngfre.com/wp-content/uploads/Cat-Paw-Print-10.png"
        />
        <q-input
          filled
          v-model="username"
          class="q-mb-md"
          label="Username"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Field cannot be empty']"
        />

        <q-input
          filled
          v-model="name"
          class="q-mb-md"
          label="Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Field cannot be empty']"
        />

        <q-select
          filled
          class="q-mb-md"
          v-model="gender"
          :options="['Male', 'Female']"
          label="Gender"
          :rules="[(val) => (val && val.length > 0) || 'Field cannot be empty']"
        />

        <q-input
          filled
          v-model="address"
          class="q-mb-md"
          label="Address"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Field cannot be empty']"
        />

        <q-input
          filled
          type="email"
          v-model="email"
          label="Email"
          class="q-mb-md"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email cannot be empty']"
        />

        <q-input
          filled
          class="q-mb-md"
          mask="(+63)##########"
          fill-mask
          v-model="phoneNumber"
          :rules="[(val) => (val && val.length > 0) || 'Field cannot be empty']"
          label="Phone Number"
        />

        <q-input
          label="Password"
          v-model="password"
          class="q-mb-md"
          filled
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            (val) => (val && val.length > 0) || 'Password cannot be empty',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          class="q-mb-md"
          label="Confirm Password"
          v-model="confirmPassword"
          filled
          :type="isPwd ? 'password' : 'text'"
          :rules="[(val) => (val && val.length > 0) || 'Email cannot be empty']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-card-actions>
          <q-btn
            color="primary"
            class="full-width q-mb-md"
            type="submit"
            label="Submit"
          />
          <q-btn
            class="full-width"
            type="reset"
            to="/login"
            flat
            color="primary"
            label="Back to login"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref, getCurrentInstance } from "vue";

import { uid } from "quasar";

defineOptions({
  name: "IndexPage",
});

const { $api } = getCurrentInstance().appContext.config.globalProperties;

const $q = useQuasar();
const $router = useRouter();

const name = ref(null);
const username = ref(null);
const gender = ref(null);
const email = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
const address = ref(null);
const phoneNumber = ref(null);
const isPwd = ref(true);

const signUp = async () => {
  $q.loading.show({
    delay: 400, // ms
  });
  try {
    const response = await $api.post("/auth/local/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      name: name.value,
      gender: gender.value,
      address: address.value,
      phoneNumber: phoneNumber.value,
      type: "user",
    });
    $q.notify({
      type: "positive",
      message: "Success!",
    });

    $router.push("/login");
  } catch (error) {
    // Handle error
    console.error("Registration failed:", error);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Registration failed. Please try again later.",
    });
  } finally {
    $q.loading.hide();
  }
};

const onSubmit = async () => {
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
      signUp();
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const onReset = () => {};
</script>
