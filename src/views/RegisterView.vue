<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import SingleImageUpload from '@/components/SingleImageUpload.vue'
import AlertBox from '@/components/AlertBox.vue'
import { ref } from 'vue'
const router = useRouter()

const validationSchema = yup.object({
    username: yup.string().required('The username is required').matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: yup.string().required('The email is required').email('Must be a valid email format').matches(/@(gmail\.com|email\.com)$/, 'Email must be @gmail.com or @email.com'),
    password: yup.string().required('The password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
    firstName: yup.string().required('The firstname is required'),
    lastName: yup.string().required('The lastname is required'),
    displayName: yup.string().required('The displayName is required'),
    phoneNumber: yup.string().required('The phone number is required').matches(/^\+?\d+$/, 'Phone number must contain only numbers and an optional leading +')
})
const { errors, handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        username: '',
        firstName: '',
        lastName: '',
        displayName: '',
        email: '', 
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        profileImage: ''
    }
})
const authStore = useAuthStore()
const { value: username } = useField<string>('username')
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email }  = useField<string>('email')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: profileImage } = useField<string>('profileImage')
const { value: displayName } = useField<string>('displayName')

const onSubmit = handleSubmit((values) => {
    console.log('Form Values:', values)
    authStore.register(values.username, values.firstName, values.lastName, values.displayName, values.email, values.password, values.profileImage, values.phoneNumber)
    .then(() => {
        alertBox.value.show = true
        alertBox.value.title = 'Register Success'
        alertBox.value.message = 'Your account has been created successfully!'
        alertBox.value.type = 'success'
    }).catch(() => {
        alertBox.value.show = true
        alertBox.value.title = 'Error'
        alertBox.value.message = 'Registration failed. Please try again.'
        alertBox.value.type = 'error'
    })
})

const alertBox = ref({
  show: false,
  title: 'Notification',
  message: '',
  type: 'success' as 'success' | 'error'
})

function onModalConfirm() {
  alertBox.value.show = false
  if (alertBox.value.type === 'success') {
    router.push({ name: 'home' })
  }
}
</script>

<template>
    <AlertBox
    :show="alertBox.show"
    :title="alertBox.title"
    :message="alertBox.message"
    :type="alertBox.type"
    confirmText="OK"
    @confirm="onModalConfirm"
    @close="alertBox.show = false"
    />
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px:8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <!-- <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"> -->
            <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up for new account</h2>
        </div>
        <span class="p-3"></span>
        <div class="m1-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="onSubmit">
                <div>
                    <label for="firstname" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                    <InputText type="text" v-model="username" placeholder="Username" :error = "errors['username']"/>
                </div>
                <div>
                    <label for="firstname" class="block text-sm font-medium leading-6 text-gray-900">FirstName</label>
                    <InputText type="text" v-model="firstName" placeholder="FirstName" :error = "errors['firstName']"/>
                </div>
                <div>
                    <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">LastName</label>
                    <InputText type="text" v-model="lastName" placeholder="LastName" :error = "errors['lastName']"/>
                </div>
                <div>
                    <label for="displayName" class="block text-sm font-medium leading-6 text-gray-900">Display Name</label>
                    <InputText type="text" v-model="displayName" placeholder="DisplayName" :error = "errors['displayName']"/>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <InputText type="text" v-model="email" placeholder="Email address" :error = "errors['email']"/>
                </div>
                <div>
                    <label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                    <InputText type="text" v-model="phoneNumber" placeholder="Phone Number" :error = "errors['phoneNumber']"/>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <InputText type="password" v-model="password" placeholder="Password" :error="errors['password']"/>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                    </div>
                    <InputText type="password" v-model="confirmPassword" placeholder="Confirm Password" :error="errors['confirmPassword']"/>
                </div>
                <SingleImageUpload type="image" v-model="profileImage" :errors="errors['profileImage']"/>
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md 
                    bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                    hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                </div>
            </form>
            <p class="mt-10 text-center text-sm text-gray-500">Already have an account? {{  ' ' }}
                <RouterLink 
                    :to="{ name: 'login' }" 
                    class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Login here
                </RouterLink>
            </p>
        </div>
    </div>
</template>