<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            type="button"
            name="pfa"
            id="pfa"
            @click="activeTab = 'pfa'"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'pfa'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Date PFA
          </button>
          <button
            type="button"
            name="account"
            id="account"
            @click="activeTab = 'account'"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'account'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Date Cont
          </button>
        </nav>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'pfa'" class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-900">Informații PFA</h2>

          <form @submit.prevent="handlePFASubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="denumire"
                >
                  Denumire
                </label>
                <input
                  v-model="pfaForm.denumire"
                  type="text"
                  id="denumire"
                  name="denumire"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: PFA Popescu Ion"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="cui"
                >
                  CUI
                </label>
                <input
                  v-model="pfaForm.cui"
                  type="text"
                  name="cui"
                  id="cui"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: RO12345678"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="nrRegCom"
                >
                  Nr. Reg. Com.
                </label>
                <input
                  v-model="pfaForm.nrRegCom"
                  type="text"
                  name="nrRegCom"
                  id="nrRegCom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: F40/123/2024"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="caen"
                >
                  Cod CAEN
                </label>
                <input
                  v-model="pfaForm.caen"
                  type="text"
                  name="caen"
                  id="caen"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: 6201"
                />
              </div>

              <div class="md:col-span-2">
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="adresa"
                >
                  Adresă
                </label>
                <input
                  v-model="pfaForm.adresa"
                  type="text"
                  name="adresa"
                  id="adresa"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: Str. Exemplu nr. 1, București"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="telefon"
                >
                  Telefon
                </label>
                <input
                  v-model="pfaForm.telefon"
                  type="text"
                  name="telefon"
                  id="telefon"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: 0712345678"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="email"
                >
                  Email
                </label>
                <input
                  v-model="pfaForm.email"
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: contact@pfa.ro"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="banca"
                >
                  Bancă
                </label>
                <input
                  v-model="pfaForm.banca"
                  type="text"
                  name="banca"
                  id="banca"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: BCR"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="iban"
                >
                  IBAN
                </label>
                <input
                  v-model="pfaForm.iban"
                  type="text"
                  name="iban"
                  id="iban"
                  autocomplete="iban"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: RO49AAAA1B31007593840000"
                />
              </div>
            </div>

            <div
              v-if="pfaMessage"
              :class="[
                'p-4 rounded-md',
                pfaMessage.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800',
              ]"
            >
              {{ pfaMessage.text }}
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                name="save"
                id="save"
                :disabled="pfaLoading"
                class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ pfaLoading ? "Se salvează..." : "Salvează Date PFA" }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="activeTab === 'account'" class="space-y-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Informații Cont
            </h2>

            <form @submit.prevent="handleAccountSubmit" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="nume"
                >
                  Nume
                </label>
                <input
                  v-model="accountForm.nume"
                  type="text"
                  name="nume"
                  id="nume"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="email"
                >
                  Email
                </label>
                <input
                  v-model="accountForm.email"
                  type="email"
                  name="email"
                  id="email"
                  required
                  autocomplete="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div
                v-if="accountMessage"
                :class="[
                  'p-4 rounded-md',
                  accountMessage.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800',
                ]"
              >
                {{ accountMessage.text }}
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  name="saveAccount"
                  id="saveAccount"
                  :disabled="accountLoading"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ accountLoading ? "Se salvează..." : "Salvează Date Cont" }}
                </button>
              </div>
            </form>
          </div>

          <div class="border-t pt-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Schimbă Parola
            </h2>

            <form @submit.prevent="handlePasswordSubmit" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="currentPassword"
                >
                  Parola Curentă
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="newPassword"
                >
                  Parolă Nouă
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="confirmPassword"
                >
                  Confirmă Parola Nouă
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div
                v-if="passwordMessage"
                :class="[
                  'p-4 rounded-md',
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800',
                ]"
              >
                {{ passwordMessage.text }}
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  name="savePassword"
                  id="savePassword"
                  :disabled="passwordLoading"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ passwordLoading ? "Se schimbă..." : "Schimbă Parola" }}
                </button>
              </div>
            </form>
          </div>

          <div class="border-t pt-6">
            <h2 class="text-lg font-semibold text-red-600 mb-2">
              Ștergere cont
            </h2>
            <p class="text-sm text-gray-600 mb-4">
              Această acțiune este permanentă. Vor fi șterse toate datele
              contului și înregistrările asociate.
            </p>

            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <label
                class="block text-sm font-medium text-gray-700 mb-2"
                for="confirmDelete"
              >
                Scrie <span class="font-semibold">STERGE</span> pentru
                confirmare
              </label>
              <input
                id="confirmDelete"
                name="confirmDelete"
                v-model="deleteConfirmText"
                type="text"
                class="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="STERGE"
              />

              <div class="flex justify-end mt-4">
                <button
                  type="button"
                  name="deleteAccount"
                  id="deleteAccount"
                  @click="handleDeleteAccount"
                  :disabled="deleteLoading || deleteConfirmText !== 'STERGE'"
                  class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ deleteLoading ? "Se șterge..." : "Șterge contul" }}
                </button>
              </div>

              <div v-if="deleteError" class="mt-3 text-sm text-red-700">
                {{ deleteError }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { finishLoading } = usePageLoad();

const {
  activeTab,
  pfaForm,
  accountForm,
  passwordForm,
  pfaLoading,
  pfaMessage,
  accountLoading,
  accountMessage,
  passwordLoading,
  passwordMessage,
  deleteConfirmText,
  deleteLoading,
  deleteError,
  initializeForms,
  handlePFASubmit,
  handleAccountSubmit,
  handlePasswordSubmit,

  handleDeleteAccount,
} = useSettings();

onMounted(() => {
  initializeForms();
  finishLoading();
});
</script>
