<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message.ts'
import SingleImageUpload from '@/components/SingleImageUpload.vue'
const router = useRouter()
const messageStore = useMessageStore()

const validationSchema = yup.object({
    username: yup.string().required('The username is required').matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: yup.string().required('The email is required'),
    password: yup.string().required('The password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
    firstname: yup.string().required('The firstname is required'),
    lastname: yup.string().required('The lastname is required'),
    displayName: yup.string().required('The displayName is required')
})
const { errors, handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        username: '',
        firstname: '',
        lastname: '',
        displayName: '',
        email: '', 
        password: '',
        confirmPassword: '',
        profileImage: ''
    }
})
const authStore = useAuthStore()
const { value: username } = useField<string>('username')
const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: email }  = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: profileImage } = useField<string>('profileImage')
const { value: displayName } = useField<string>('displayName')

const onSubmit = handleSubmit((values) => {
    authStore.register(values. username, values.firstname, values.lastname, values.displayName, values.email, values.password, values.profileImage)
    .then(() => {
        router.push({ name: 'home' })
    }).catch(() => {
        messageStore.updateMessage('could not login')
        setTimeout(() => {
            messageStore.resetMessage()
        }, 3000)
    })
})
</script>

<template>
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
                    <InputText type="text" v-model="firstname" placeholder="FirstName" :error = "errors['firstname']"/>
                </div>
                <div>
                    <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">LastName</label>
                    <InputText type="text" v-model="lastname" placeholder="LastName" :error = "errors['lastname']"/>
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